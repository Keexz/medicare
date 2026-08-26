import { StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

interface StepDotsProps {
  count: number;
  activeIndex: number;
}

/** Minimal progress indicator for the multi-step booking flow. */
export function StepDots({ count, activeIndex }: StepDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex && styles.activeDot,
            index < activeIndex && styles.doneDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: Radius.pill,
    backgroundColor: Colors.border,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  doneDot: {
    backgroundColor: Colors.primarySoft,
  },
});
