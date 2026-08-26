import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DoctorAvatar } from '@/components/doctor-avatar';
import { useAppointments } from '@/context/AppointmentsContext';
import {
  CardShadow,
  Colors,
  FontSize,
  FontWeight,
  MinTouchTarget,
  Radius,
  Spacing,
} from '@/constants/theme';
import {
  formatDateShort,
  formatTime,
  isUpcoming,
} from '@/utils/dates';
import type { Appointment } from '@/types';

export default function AppointmentsScreen() {
  const router = useRouter();
  const { appointments, hydrated, cancelAppointment, getDoctorById } = useAppointments();

  const upcoming = sortByDateTime(
    appointments.filter(
      (appointment) => appointment.status === 'Confirmed' && isUpcoming(appointment),
    ),
  );
  const past = sortByDateTime(
    appointments.filter(
      (appointment) => appointment.status === 'Confirmed' && !isUpcoming(appointment),
    ),
  );
  const cancelled = sortByDateTime(
    appointments.filter((appointment) => appointment.status === 'Cancelled'),
  );

  function confirmCancel(appointment: Appointment) {
    const doctor = getDoctorById(appointment.doctorId);
    Alert.alert(
      'Cancel appointment',
      `Cancel your visit with ${doctor?.name ?? 'the doctor'} on ${formatDateShort(
        appointment.dateISO,
      )} at ${formatTime(appointment.time)}?`,
      [
        { text: 'Keep it', style: 'cancel' },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: () => cancelAppointment(appointment.id),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Appointments</Text>
          <Text style={styles.headerSubtitle}>Manage your upcoming visits</Text>
        </View>

        {!hydrated ? (
          <Text style={styles.emptyText}>Loading…</Text>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <Text style={styles.emptyText}>
              Book your first visit in under a minute.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Book appointment"
              onPress={() => router.push('/booking')}
              style={({ pressed }) => [styles.emptyCta, pressed && styles.pressed]}
            >
              <Text style={styles.emptyCtaText}>Book Appointment</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {upcoming.length > 0 ? (
              <>
                <SectionHeader label={`Upcoming (${upcoming.length})`} />
                {upcoming.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    action={
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Cancel appointment"
                        onPress={() => confirmCancel(appointment)}
                        style={({ pressed }) => [
                          styles.cancelButton,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Ionicons name="close-circle-outline" size={16} color={Colors.danger} />
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </Pressable>
                    }
                  />
                ))}
              </>
            ) : null}

            {past.length > 0 ? (
              <>
                <SectionHeader label="Past" />
                {past.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </>
            ) : null}

            {cancelled.length > 0 ? (
              <>
                <SectionHeader label="Cancelled" />
                {cancelled.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} muted />
                ))}
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function sortByDateTime(list: Appointment[]): Appointment[] {
  return [...list].sort((a, b) =>
    `${a.dateISO}T${a.time}`.localeCompare(`${b.dateISO}T${b.time}`),
  );
}

function AppointmentCard({
  appointment,
  action,
  muted = false,
}: {
  appointment: Appointment;
  action?: React.ReactNode;
  muted?: boolean;
}) {
  const { getDoctorById } = useAppointments();
  const doctor = getDoctorById(appointment.doctorId);

  return (
    <View style={[styles.card, muted && styles.cardMuted]}>
      <DoctorAvatar fullName={doctor?.name ?? '?'} size={48} />
      <View style={styles.cardBody}>
        <Text style={[styles.doctorName, muted && styles.textMuted]}>
          {doctor?.name ?? 'Unknown doctor'}
        </Text>
        <Text style={[styles.metaText, muted && styles.textMuted]}>
          {formatDateShort(appointment.dateISO)} · {formatTime(appointment.time)}
        </Text>
      </View>
      {appointment.status === 'Cancelled' ? (
        <View style={styles.statusChipCancelled}>
          <Text style={styles.statusChipCancelledText}>Cancelled</Text>
        </View>
      ) : action}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    ...CardShadow,
  },
  cardMuted: {
    opacity: 0.65,
  },
  cardBody: {
    flex: 1,
  },
  doctorName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.primaryDark,
    marginTop: 2,
    fontWeight: FontWeight.medium,
  },
  textMuted: {
    color: Colors.textMuted,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    borderRadius: Radius.sm,
    minHeight: MinTouchTarget - 6,
    paddingHorizontal: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.danger,
  },
  statusChipCancelled: {
    backgroundColor: Colors.dangerSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  statusChipCancelledText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.danger,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.lg,
    gap: Spacing.sm,
    ...CardShadow,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginHorizontal: Spacing.lg,
  },
  emptyCta: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    minHeight: MinTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  emptyCtaText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
