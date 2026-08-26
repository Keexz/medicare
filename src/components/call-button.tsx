import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';

import { clinicInfo } from '@/context/AppointmentsContext';
import {
  Colors,
  FontSize,
  FontWeight,
  MinTouchTarget,
  Radius,
  Spacing,
} from '@/constants/theme';

interface CallButtonProps {
  label?: string;
  variant?: 'solid' | 'danger';
}

/** Opens the real phone dialer with the clinic number (constraint #14). */
export function CallButton({ label = 'Call Clinic', variant = 'solid' }: CallButtonProps) {
  const dial = () => {
    Linking.openURL(`tel:${clinicInfo.phoneDial}`).catch(() => {
      // No dialer available (e.g. web preview); nothing to do in the demo.
    });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} ${clinicInfo.phoneDisplay}`}
      onPress={dial}
      style={({ pressed }) => [
        styles.base,
        variant === 'solid' ? styles.solid : styles.danger,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name="call"
        size={18}
        color={variant === 'solid' ? Colors.textOnPrimary : Colors.danger}
      />
      <Text style={[styles.label, variant === 'danger' && styles.dangerLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    minHeight: MinTouchTarget,
    paddingHorizontal: Spacing.md,
  },
  solid: {
    backgroundColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.dangerSoft,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  dangerLabel: {
    color: Colors.danger,
  },
});
