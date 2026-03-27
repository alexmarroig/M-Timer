import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing, borderRadius } from '../../../core/theme';
import { GamificationSnapshot } from '../../../types/stats';

interface Props {
  data: GamificationSnapshot;
}

function ProgressBar({ progress, color = colors.primary }: { progress: number; color?: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(progress, 1)) * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

export function GamificationPanel({ data }: Props) {
  const topAchievements = data.achievements.slice(0, 3);

  return (
    <Card>
      <MinimalText variant="subheading">Meta semanal</MinimalText>
      <MinimalText variant="caption" color={colors.textSecondary} style={styles.levelText}>
        Nível {data.weeklyGoal.level} · {data.weeklyGoal.levelLabel}
      </MinimalText>

      <View style={styles.rowItem}>
        <MinimalText variant="caption" color={colors.textSecondary}>
          Sessões ({data.weeklyGoal.sessionsCompleted}/{data.weeklyGoal.goal.targetSessions})
        </MinimalText>
        <ProgressBar progress={data.weeklyGoal.sessionsProgress} color={colors.core} />
      </View>

      <View style={styles.rowItem}>
        <MinimalText variant="caption" color={colors.textSecondary}>
          Minutos ({data.weeklyGoal.minutesCompleted}/{data.weeklyGoal.goal.targetMinutes})
        </MinimalText>
        <ProgressBar progress={data.weeklyGoal.minutesProgress} color={colors.accent} />
      </View>

      <MinimalText variant="caption" color={colors.primaryLight} style={styles.feedback}>
        {data.weeklyGoal.motivationalMessage}
      </MinimalText>

      <View style={styles.sectionDivider} />

      <MinimalText variant="subheading">Conquistas</MinimalText>
      {topAchievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementItem}>
          <View style={styles.achievementHeader}>
            <MinimalText variant="caption" color={achievement.unlocked ? colors.success : colors.textSecondary}>
              {achievement.unlocked ? '✅' : '⬜️'} {achievement.title}
            </MinimalText>
            <MinimalText variant="caption" color={colors.textSecondary}>
              {achievement.current}/{achievement.target}
            </MinimalText>
          </View>
          <ProgressBar progress={achievement.progress} color={achievement.unlocked ? colors.success : colors.primaryLight} />
        </View>
      ))}

      {data.antiFraud.blockedSessions > 0 && (
        <MinimalText variant="caption" color={colors.textSecondary} style={styles.antiFraudText}>
          Anti-fraude: {data.antiFraud.blockedSessions} sessão(ões) não contaram. {data.antiFraud.lastBlockedReason}
        </MinimalText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  levelText: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  rowItem: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  progressTrack: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  feedback: {
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  achievementItem: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  antiFraudText: {
    marginTop: spacing.md,
  },
});
