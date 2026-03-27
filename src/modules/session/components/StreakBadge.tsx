import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing, borderRadius } from '../../../core/theme';

interface Props {
  currentStreak: number;
  sessionsToday: number;
}

export function StreakBadge({ currentStreak, sessionsToday }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <MinimalText variant="subheading" color={colors.accent} align="center">
          {currentStreak}
        </MinimalText>
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
