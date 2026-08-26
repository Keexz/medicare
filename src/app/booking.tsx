import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DoctorAvatar } from '@/components/doctor-avatar';
import { StepDots } from '@/components/step-dots';
import { doctors, useAppointments } from '@/context/AppointmentsContext';
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
  BOOKING_TIMES,
  formatDateLong,
  formatTime,
  getBookingWindow,
  getDateChipParts,
  isWeekend,
  toDateISO,
} from '@/utils/dates';

const STEP_COUNT = 3;

function isSlotPast(dateISO: string, slot: string): boolean {
  const now = new Date();
  if (dateISO !== toDateISO(now)) return false;
  const [hour] = slot.split(':').map(Number);
  return hour <= now.getHours();
}

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ doctorId?: string }>();
  const { addAppointment } = useAppointments();

  const [step, setStep] = useState(0);
  const [doctorId, setDoctorId] = useState<string | null>(
    typeof params.doctorId === 'string' &&
      doctors.some((doctor) => doctor.id === params.doctorId)
      ? params.doctorId
      : null,
  );
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('Demo Patient');

  const windowDays = useMemo(() => getBookingWindow(), []);
  const todayISO = toDateISO(new Date());
  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);

  const canContinue =
    step === 0
      ? doctorId !== null
      : step === 1
        ? dateISO !== null && time !== null
        : patientName.trim().length > 0;

  function handleDatePress(iso: string) {
    setDateISO(iso);
    if (time && isSlotPast(iso, time)) {
      setTime(null);
    }
  }

  function handlePrimaryPress() {
    if (!canContinue) return;
    if (step < STEP_COUNT - 1) {
      setStep(step + 1);
      return;
    }
    if (!doctorId || !dateISO || !time) return;
    const created = addAppointment({
      doctorId,
      patientName: patientName.trim(),
      dateISO,
      time,
    });
    router.replace({ pathname: '/booking-success', params: { id: created.id } });
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <StepDots count={STEP_COUNT} activeIndex={step} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 0 ? (
          <>
            <Text style={styles.sectionTitle}>Choose your doctor</Text>
            {doctors.map((doctor) => {
              const selected = doctor.id === doctorId;
              return (
                <Pressable
                  key={doctor.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${doctor.name}, ${doctor.specialty}`}
                  onPress={() => setDoctorId(doctor.id)}
                  style={({ pressed }) => [
                    styles.doctorRow,
                    selected && styles.doctorRowSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <DoctorAvatar fullName={doctor.name} size={48} />
                  <View style={styles.doctorBody}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                  </View>
                  <Ionicons
                    name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={selected ? Colors.primary : Colors.border}
                  />
                </Pressable>
              );
            })}
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Text style={styles.sectionTitle}>Pick a date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateRow}
            >
              {windowDays.map((day) => {
                const iso = toDateISO(day);
                const weekend = isWeekend(day);
                const selected = iso === dateISO;
                const chip = getDateChipParts(iso);
                return (
                  <Pressable
                    key={iso}
                    disabled={weekend}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, disabled: weekend }}
                    onPress={() => handleDatePress(iso)}
                    style={[
                      styles.dateChip,
                      selected && styles.dateChipSelected,
                      weekend && styles.dateChipDisabled,
                    ]}
                  >
                    <Text
                      style={[styles.dateChipTop, selected && styles.dateChipTextSelected]}
                    >
                      {iso === todayISO ? 'Today' : chip.weekday}
                    </Text>
                    <Text
                      style={[
                        styles.dateChipMain,
                        selected && styles.dateChipTextSelected,
                      ]}
                    >
                      {chip.dayMonth}
                    </Text>
                    {weekend ? (
                      <Text style={styles.dateChipClosed}>Closed</Text>
                    ) : (
                      <Text style={styles.dateChipSpacer}> </Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.sectionTitle}>Available times</Text>
            <View style={styles.timeGrid}>
              {BOOKING_TIMES.map((slot) => {
                const past = dateISO !== null && isSlotPast(dateISO, slot);
                const selected = slot === time;
                const disabled = dateISO === null || past;
                return (
                  <Pressable
                    key={slot}
                    disabled={disabled}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, disabled }}
                    onPress={() => setTime(slot)}
                    style={[
                      styles.timeChip,
                      selected && styles.timeChipSelected,
                      disabled && styles.timeChipDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        selected && styles.timeChipTextSelected,
                        disabled && styles.timeChipTextDisabled,
                      ]}
                    >
                      {formatTime(slot)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {dateISO === null ? (
              <Text style={styles.hint}>Select a date to see open slots.</Text>
            ) : (
              <Text style={styles.hint}>
                Clinic hours: Monday–Friday, 9:00 AM – 5:00 PM.
              </Text>
            )}
          </>
        ) : null}

        {step === 2 && selectedDoctor && dateISO && time ? (
          <>
            <Text style={styles.sectionTitle}>Patient details</Text>
            <Text style={styles.fieldLabel}>Full name</Text>
            <TextInput
              value={patientName}
              onChangeText={setPatientName}
              placeholder="Enter patient name"
              placeholderTextColor={Colors.textMuted}
              autoCorrect={false}
              autoComplete="name"
              style={styles.input}
            />

            <Text style={styles.sectionTitle}>Review</Text>
            <View style={styles.reviewCard}>
              <ReviewRow icon="person-outline" label="Patient" value={patientName.trim()} />
              <View style={styles.reviewDivider} />
              <ReviewRow
                icon="medkit-outline"
                label="Doctor"
                value={`${selectedDoctor.name} · ${selectedDoctor.specialty}`}
              />
              <View style={styles.reviewDivider} />
              <ReviewRow
                icon="calendar-outline"
                label="When"
                value={`${formatDateLong(dateISO)} at ${formatTime(time)}`}
              />
            </View>
          </>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            step === STEP_COUNT - 1 ? 'Confirm appointment' : 'Continue'
          }
          disabled={!canContinue}
          onPress={handlePrimaryPress}
          style={({ pressed }) => [
            styles.primaryButton,
            !canContinue && styles.primaryButtonDisabled,
            pressed && canContinue && styles.pressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {step === STEP_COUNT - 1 ? 'Confirm Appointment' : 'Continue'}
          </Text>
          <Ionicons
            name={step === STEP_COUNT - 1 ? 'checkmark' : 'arrow-forward'}
            size={20}
            color={Colors.textOnPrimary}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ReviewRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.reviewRow}>
      <View style={styles.reviewIcon}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <View style={styles.reviewBody}>
        <Text style={styles.reviewLabel}>{label}</Text>
        <Text style={styles.reviewValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm + 4,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...CardShadow,
  },
  doctorRowSelected: {
    borderColor: Colors.primary,
  },
  doctorBody: {
    flex: 1,
  },
  doctorName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  doctorSpecialty: {
    fontSize: FontSize.sm,
    color: Colors.primaryDark,
    marginTop: 2,
  },
  dateRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  dateChip: {
    width: 76,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    ...CardShadow,
  },
  dateChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateChipDisabled: {
    opacity: 0.45,
  },
  dateChipTop: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  dateChipMain: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: 2,
  },
  dateChipTextSelected: {
    color: Colors.textOnPrimary,
  },
  dateChipClosed: {
    fontSize: 10,
    color: Colors.danger,
    marginTop: 2,
  },
  dateChipSpacer: {
    fontSize: 10,
    marginTop: 2,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeChip: {
    width: '30%',
    minHeight: MinTouchTarget,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    ...CardShadow,
  },
  timeChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeChipDisabled: {
    opacity: 0.4,
  },
  timeChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  timeChipTextSelected: {
    color: Colors.textOnPrimary,
    fontWeight: FontWeight.semibold,
  },
  timeChipTextDisabled: {
    color: Colors.textMuted,
  },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: MinTouchTarget + 4,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...CardShadow,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  reviewIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBody: {
    flex: 1,
  },
  reviewLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  reviewValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginTop: 1,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
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
  primaryButtonDisabled: {
    backgroundColor: Colors.border,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
