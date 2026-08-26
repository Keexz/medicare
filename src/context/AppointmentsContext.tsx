import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import rawClinicData from '@/data/clinic.json';
import { addDays, toDateISO, toNextWeekday } from '@/utils/dates';
import type {
  Appointment,
  ClinicInfo,
  Doctor,
  NewAppointmentInput,
  Service,
} from '@/types';

const STORAGE_KEY = 'medicare.appointments.v1';

interface RawSampleAppointment {
  id: string;
  doctorId: string;
  patientName: string;
  time: string;
  status: Appointment['status'];
  /** Calendar-day offset from today used to keep demo dates fresh forever. */
  inDays: number;
}

interface ClinicData {
  clinic: ClinicInfo;
  doctors: Doctor[];
  services: Service[];
  sampleAppointments: RawSampleAppointment[];
}

export const clinicData = rawClinicData as unknown as ClinicData;

export const clinicInfo: ClinicInfo = clinicData.clinic;
export const doctors: Doctor[] = clinicData.doctors;
export const services: Service[] = clinicData.services;

function materializeSamples(): Appointment[] {
  const today = new Date();
  return clinicData.sampleAppointments.map((sample) => ({
    id: sample.id,
    doctorId: sample.doctorId,
    patientName: sample.patientName,
    // Samples must also respect Mon–Fri clinic days.
    dateISO: toDateISO(toNextWeekday(addDays(today, sample.inDays))),
    time: sample.time,
    status: sample.status,
  }));
}

interface AppointmentsContextValue {
  appointments: Appointment[];
  /** False until AsyncStorage has been read once; screens show a placeholder. */
  hydrated: boolean;
  addAppointment: (input: NewAppointmentInput) => Appointment;
  cancelAppointment: (id: string) => void;
  getDoctorById: (id: string) => Doctor | undefined;
}

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled) {
          setAppointments(stored ? (JSON.parse(stored) as Appointment[]) : materializeSamples());
        }
      } catch {
        if (!cancelled) setAppointments(materializeSamples());
      } finally {
        if (!cancelled) {
          hydratedRef.current = true;
          setHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appointments)).catch(() => {
      // Storage failures are non-fatal in this local-only demo.
    });
  }, [appointments]);

  const addAppointment = useCallback((input: NewAppointmentInput): Appointment => {
    const created: Appointment = {
      id: `apt-${Date.now()}`,
      ...input,
      status: 'Confirmed',
    };
    setAppointments((prev) => [...prev, created]);
    return created;
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, status: 'Cancelled' } : appointment,
      ),
    );
  }, []);

  const getDoctorById = useCallback(
    (id: string) => doctors.find((doctor) => doctor.id === id),
    [],
  );

  const value = useMemo(
    () => ({
      appointments,
      hydrated,
      addAppointment,
      cancelAppointment,
      getDoctorById,
    }),
    [appointments, hydrated, addAppointment, cancelAppointment, getDoctorById],
  );

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments(): AppointmentsContextValue {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentsProvider');
  }
  return context;
}
