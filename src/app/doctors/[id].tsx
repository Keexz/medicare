import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DoctorAvatar } from '@/components/doctor-avatar';
import { doctors } from '@/context/AppointmentsContext';
import {
  Colors,
  FontSize,
  FontWeight,
  MinTouchTarget,
  Radius,
  Spacing,
} from '@/constants/theme';

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = doctors.find((candidate) => candidate.id === id);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missingWrap}>
          <Text style={styles.missingText}>Doctor not found.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backLink, pressed && styles.pressed]}
          >
            <Text style={styles.backLinkText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textOnPrimary} />
          </Pressable>
          <View style={styles.heroBody}>
            <DoctorAvatar fullName={doctor.name} size={88} />
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          </View>
        </View>

        <View style={[styles.card, styles.statsCard]}>
          <View style={styles.statItem}>
            <Ionicons name="ribbon-outline" size={18} color={Colors.primary} />
            <Text style={styles.statValue}>{doctor.experienceYears} yrs</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={18} color={Colors.primary} />
            <Text style={styles.statValue}>Mon–Fri</Text>
            <Text style={styles.statLabel}>Available days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.primary} />
            <Text style={styles.statValue}>In person</Text>
            <Text style={styles.statLabel}>Visit type</Text>
          </View>
        </View>

        <View style={[styles.card, styles.bioCard]}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{doctor.bio}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Book appointment with ${doctor.name}`}
          onPress={() =>
            router.push({ pathname: '/booking', params: { doctorId: doctor.id } })
          }
          style={({ pressed }) => [styles.bookCta, pressed && styles.pressed]}
        >
          <Ionicons name="calendar-outline" size={20} color={Colors.textOnPrimary} />
          <Text style={styles.bookCtaText}>Book with {doctor.name.split(' ')[1] ?? doctor.name}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
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
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.sm,
  },
  heroBody: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  doctorName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
  doctorSpecialty: {
    fontSize: FontSize.md,
    color: Colors.primarySoft,
    marginTop: -Spacing.sm + 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: 2,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
  bioCard: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  bioText: {
    fontSize: FontSize.sm,
    lineHeight: 21,
    color: Colors.textMuted,
  },
  bookCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    minHeight: MinTouchTarget + 8,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  bookCtaText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  missingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  missingText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  backLink: {
    minHeight: MinTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  backLinkText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
