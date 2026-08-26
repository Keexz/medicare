import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DoctorAvatar } from '@/components/doctor-avatar';
import { doctors } from '@/context/AppointmentsContext';
import {
  CardShadow,
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
} from '@/constants/theme';

export default function DoctorsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Our Doctors</Text>
          <Text style={styles.headerSubtitle}>
            {doctors.length} specialists ready to help you
          </Text>
        </View>

        <View style={styles.list}>
          {doctors.map((doctor) => (
            <Pressable
              key={doctor.id}
              accessibilityRole="button"
              accessibilityLabel={`View ${doctor.name}, ${doctor.specialty}`}
              onPress={() => router.push(`/doctors/${doctor.id}`)}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
            >
              <DoctorAvatar fullName={doctor.name} />
              <View style={styles.cardBody}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                <View style={styles.experienceChip}>
                  <Ionicons name="ribbon-outline" size={12} color={Colors.primaryDark} />
                  <Text style={styles.experienceText}>
                    {doctor.experienceYears} yrs experience
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </Pressable>
          ))}
        </View>
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
  list: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...CardShadow,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  cardBody: {
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
  experienceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryFaint,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginTop: Spacing.sm,
  },
  experienceText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.primaryDark,
  },
});
