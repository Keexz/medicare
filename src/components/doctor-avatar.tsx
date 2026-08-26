import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontWeight } from '@/constants/theme';

interface DoctorAvatarProps {
  fullName: string;
  /** Circle diameter in px; label scales automatically. */
  size?: number;
}

/** Initials extracted without the "Dr." title, e.g. "Dr. Sarah Chen" → "SC". */
export function getDoctorInitials(fullName: string): string {
  const withoutTitle = fullName.replace(/^Dr\.?\s+/i, '');
  const initials = withoutTitle
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2);
  return initials.toUpperCase();
}

/** Teal initials avatar — replaces photo assets per constraint #13. */
export function DoctorAvatar({ fullName, size = 56 }: DoctorAvatarProps) {
  return (
    <View
      accessibilityElementsHidden
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.round(size * 0.36) }]}>
        {getDoctorInitials(fullName)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.textOnPrimary,
    fontWeight: FontWeight.semibold,
  },
});
