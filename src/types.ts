export interface ClinicInfo {
  name: string;
  tagline: string;
  phoneDisplay: string;
  phoneDial: string;
  address: string;
  hours: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  bio: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMin: number;
}

export type AppointmentStatus = 'Confirmed' | 'Cancelled';

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  /** Calendar day as `yyyy-mm-dd` (locale-independent). */
  dateISO: string;
  /** 24-hour clock slot start, e.g. `"14:00"`. */
  time: string;
  status: AppointmentStatus;
}

export type NewAppointmentInput = Omit<Appointment, 'id' | 'status'>;
