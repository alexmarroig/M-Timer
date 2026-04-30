import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing, borderRadius } from '../../../core/theme';

interface Props {
  currentStreak: number;
  sessionsToday: number;
}

export function StreakBadge({ currentStreak, sessionsToday }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    pulseRef.current?.stop();
    if (currentStreak > 0) {
      pulseRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      pulseRef.current.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => pulseRef.current?.stop();
  }, [currentStreak]);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <MinimalText variant="subheading" color={colors.accent} align="center">
            {currentStreak}
          </MinimalText>
        </Animated.View>
        <MinimalText variant="caption" align="center">
          {currentStreak === 1 ? 'dia' : 'dias'} seguidos
        </MinimalText>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <MinimalText variant="subheading" color={colors.primary} align="center">
          {sessionsToday}/2
        </MinimalText>
        <MinimalText variant="caption" align="center">
          sessões hoje
        </MinimalText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
});
