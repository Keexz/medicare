import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CallButton } from '@/components/call-button';
import { Fab } from '@/components/fab';
import {
  clinicInfo,
  services,
  useAppointments,
} from '@/context/AppointmentsContext';
import {
  CardShadow,
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
} from '@/constants/theme';
import { formatDateShort, formatTime, isUpcoming } from '@/utils/dates';

export default function HomeScreen() {
  const router = useRouter();
  const { appointments, hydrated, getDoctorById } = useAppointments();

  const nextAppointment = appointments.find(
    (appointment) => appointment.status === 'Confirmed' && isUpcoming(appointment),
  );
  const nextDoctor = nextAppointment ? getDoctorById(nextAppointment.doctorId) : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{clinicInfo.name}</Text>
          <Text style={styles.headerSubtitle}>{clinicInfo.tagline}</Text>
        </View>

        {hydrated && nextAppointment && nextDoctor ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View upcoming appointment"
            onPress={() => router.push('/appointments')}
            style={({ pressed }) => [styles.card, styles.nextCard, pressed && { opacity: 0.9 }]}
          >
            <View style={styles.nextTopRow}>
              <Text style={styles.sectionLabel}>NEXT APPOINTMENT</Text>
              <View style={styles.confirmedChip}>
                <Text style={styles.confirmedChipText}>Confirmed</Text>
              </View>
            </View>
            <Text style={styles.nextDoctor}>{nextDoctor.name}</Text>
            <View style={styles.nextMetaRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primaryDark} />
              <Text style={styles.nextMeta}>
                {formatDateShort(nextAppointment.dateISO)} · {formatTime(nextAppointment.time)}
              </Text>
            </View>
          </Pressable>
        ) : null}

        <View style={[styles.card, styles.emergencyCard]}>
          <View style={styles.emergencyTextWrap}>
            <Text style={styles.emergencyTitle}>Need urgent help?</Text>
            <Text style={styles.emergencyBody}>
              Call us during opening hours — {clinicInfo.hours}.
            </Text>
          </View>
          <CallButton label="Emergency Call" variant="danger" />
        </View>

        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.serviceList}>
          {services.map((service) => (
            <View key={service.id} style={[styles.card, styles.serviceCard]}>
              <View style={styles.serviceIcon}>
                <Ionicons name="medkit-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.serviceBody}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {service.description}
                </Text>
              </View>
              <Text style={styles.serviceDuration}>{service.durationMin} min</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Fab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xl + 64,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md + Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.primarySoft,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    ...CardShadow,
  },
  nextCard: {
    marginTop: -Spacing.lg,
  },
  nextTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  confirmedChip: {
    backgroundColor: Colors.successSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
  },
  confirmedChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.success,
  },
  nextDoctor: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  nextMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  nextMeta: {
    fontSize: FontSize.sm,
    color: Colors.primaryDark,
    fontWeight: FontWeight.medium,
  },
  emergencyCard: {
    marginTop: Spacing.md,
    backgroundColor: Colors.dangerSoft,
    elevation: 0,
    shadowOpacity: 0,
  },
  emergencyTextWrap: {
    marginBottom: Spacing.sm + 2,
  },
  emergencyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.danger,
  },
  emergencyBody: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
  },
  serviceList: {
    gap: Spacing.md,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: 0,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBody: {
    flex: 1,
  },
  serviceName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  serviceDescription: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  serviceDuration: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.primaryDark,
    backgroundColor: Colors.primaryFaint,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
});
