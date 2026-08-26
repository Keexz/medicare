import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { clinicInfo } from '@/context/AppointmentsContext';
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
} from '@/constants/theme';

const HIGHLIGHTS = [
  { icon: 'calendar-outline', label: 'Book a visit in under a minute' },
  { icon: 'people-outline', label: 'Four experienced doctors on staff' },
  { icon: 'call-outline', label: 'One-tap call to the clinic' },
] as const;

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={44} color={Colors.primary} />
          </View>
          <Text style={styles.clinicName}>{clinicInfo.name}</Text>
          <Text style={styles.tagline}>{clinicInfo.tagline}</Text>
        </View>

        <View style={styles.sheet}>
          {HIGHLIGHTS.map((item) => (
            <View key={item.label} style={styles.highlightRow}>
              <View style={styles.highlightIcon}>
                <Ionicons name={item.icon} size={20} color={Colors.primary} />
              </View>
              <Text style={styles.highlightLabel}>{item.label}</Text>
            </View>
          ))}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Get started"
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.ctaText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.textOnPrimary} />
          </Pressable>

          <Text style={styles.disclaimer}>
            Demo app for MediCare Clinic — not a real medical service.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clinicName: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.primarySoft,
    textAlign: 'center',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 44,
  },
  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightLabel: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    minHeight: 52,
    marginTop: Spacing.sm,
  },
  ctaPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  ctaText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  disclaimer: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
