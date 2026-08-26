import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppointments } from '@/context/AppointmentsContext';
import {
  Colors,
  FontSize,
  FontWeight,
  MinTouchTarget,
  Radius,
  Spacing,
} from '@/constants/theme';
import { formatDateLong, formatTime } from '@/utils/dates';

export default function BookingSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { appointments, getDoctorById } = useAppointments();

  const appointment =
    appointments.find((candidate) => candidate.id === id) ??
    appointments[appointments.length - 1];
  const doctor = appointment ? getDoctorById(appointment.doctorId) : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={44} color={Colors.textOnPrimary} />
          </View>
          <Text style={styles.title}>Appointment Confirmed</Text>
          <Text style={styles.subtitle}>
            We&apos;ve saved your visit. See you soon!
          </Text>
        </View>

        {appointment && doctor ? (
          <View style={styles.summaryCard}>
            <SummaryRow label="Doctor" value={`${doctor.name}`} />
            <View style={styles.divider} />
            <SummaryRow label="Specialty" value={doctor.specialty} />
            <View style={styles.divider} />
            <SummaryRow
              label="When"
              value={`${formatDateLong(appointment.dateISO)} · ${formatTime(appointment.time)}`}
            />
            <View style={styles.divider} />
            <SummaryRow label="Patient" value={appointment.patientName} />
          </View>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/appointments')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Ionicons name="calendar" size={20} color={Colors.textOnPrimary} />
            <Text style={styles.primaryButtonText}>View My Appointments</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/home')}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, styles.summaryValueAlign]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    width: 90,
  },
  summaryValue: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    textAlign: 'right',
  },
  summaryValueAlign: {},
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  actions: {
    marginTop: 'auto',
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    minHeight: MinTouchTarget + 8,
  },
  primaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    minHeight: MinTouchTarget + 8,
    backgroundColor: Colors.surface,
  },
  secondaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryDark,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
