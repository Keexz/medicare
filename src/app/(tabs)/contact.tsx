import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CallButton } from '@/components/call-button';
import { clinicInfo } from '@/context/AppointmentsContext';
import {
  CardShadow,
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
} from '@/constants/theme';

export default function ContactScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contact & Emergency</Text>
          <Text style={styles.headerSubtitle}>We&apos;re here to help</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.clinicRow}>
            <View style={styles.iconWrap}>
              <Ionicons name="medkit" size={20} color={Colors.primary} />
            </View>
            <View style={styles.clinicBody}>
              <Text style={styles.clinicName}>{clinicInfo.name}</Text>
              <Text style={styles.hoursText}>{clinicInfo.hours}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <InfoRow icon="location-outline" label="Address" value={clinicInfo.address} />
          <View style={styles.divider} />
          <InfoRow icon="call-outline" label="Phone" value={clinicInfo.phoneDisplay} />

          <View style={styles.callWrap}>
            <CallButton label={`Call ${clinicInfo.phoneDisplay}`} />
          </View>
        </View>

        <View style={[styles.card, styles.emergencyCard]}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="warning" size={22} color={Colors.danger} />
            <Text style={styles.emergencyTitle}>Emergency</Text>
          </View>
          <Text style={styles.emergencyBody}>
            For urgent medical concerns during opening hours, call the clinic
            immediately — we&apos;ll prioritise your call.
          </Text>
          <CallButton label="Call Clinic Now" variant="danger" />
        </View>

        <Text style={styles.footnote}>
          Demo app — phone number is fictional and not monitored.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.infoBody}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    ...CardShadow,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  clinicBody: {
    flex: 1,
  },
  clinicName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  hoursText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  infoBody: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  callWrap: {
    marginTop: Spacing.sm + 2,
  },
  emergencyCard: {
    backgroundColor: Colors.dangerSoft,
    shadowOpacity: 0,
    elevation: 0,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  emergencyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.danger,
  },
  emergencyBody: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
    marginBottom: Spacing.sm + 2,
  },
  footnote: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginHorizontal: Spacing.xl,
  },
});
