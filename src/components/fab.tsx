import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  Colors,
  FabShadow,
  FontSize,
  FontWeight,
  MinTouchTarget,
  Radius,
  Spacing,
} from '@/constants/theme';

/** Extended floating action button that starts the booking flow (Home only). */
export function Fab() {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Book appointment"
      onPress={() => router.push('/booking')}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
    >
      <Ionicons name="add" size={24} color={Colors.textOnPrimary} />
      <Text style={styles.fabText}>Book Appointment</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.pill,
    minHeight: MinTouchTarget + 8,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.lg,
    ...FabShadow,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
  fabText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
