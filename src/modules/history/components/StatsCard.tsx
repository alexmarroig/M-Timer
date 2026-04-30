import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stats } from '../../../types/stats';
import { MinimalText } from '../../../components/ui/MinimalText';
import { Card } from '../../../components/ui/Card';
import { colors, spacing } from '../../../core/theme';

interface Props {
  stats: Stats;
}

export function StatsCard({ stats }: Props) {
  return (
    <Card>
      <View style={styles.grid}>
        <StatItem label="Total sessões" value={String(stats.totalSessions)} />
        <StatItem label="Total minutos" value={String(stats.totalMinutes)} />
        <StatItem label="Sequência atual" value={`${stats.currentStreak} dias`} />
        <StatItem label="Maior sequência" value={`${stats.longestStreak} dias`} />
      </View>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <MinimalText variant="subheading" color={colors.primary} align="center">
        {value}
      </MinimalText>
      <MinimalText variant="caption" color={colors.textSecondary} align="center">
        {label}
      </MinimalText>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
