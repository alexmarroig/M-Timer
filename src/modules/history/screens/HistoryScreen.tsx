import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { Card } from '../../../components/ui/Card';
import { MinimalText } from '../../../components/ui/MinimalText';
import { Companion } from '../../../components/Companion';
import { useCompanion } from '../../../hooks/useCompanion';
import { SessionListItem } from '../components/SessionListItem';
import { CalendarView } from '../components/CalendarView';
import { StatsCard } from '../components/StatsCard';
import { useHistoryStore } from '../../../store/historyStore';
import { colors, spacing, borderRadius } from '../../../core/theme';

export function HistoryScreen() {
  const sessions = useHistoryStore((state) => state.sessions);
  const getSessionDates = useHistoryStore((state) => state.getSessionDates);
  const { stats, profile, companionState } = useCompanion({
    placement: 'home',
  });
  const sessionDates = getSessionDates();

  const renderHeader = () => (
    <View>
      <MinimalText variant="heading" style={styles.title}>
        Histórico
      </MinimalText>

      <View style={styles.section}>
        <CalendarView sessionDates={sessionDates} />
      </View>

      <View style={styles.section}>
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <MinimalText variant="subheading">Evolução do companion</MinimalText>
              <MinimalText variant="caption" color={colors.textSecondary}>
                Nível {profile.currentLevel} - {profile.levelLabel}
              </MinimalText>
            </View>
            <MinimalText variant="body" color={colors.primary}>
              {profile.xpTotal} XP
            </MinimalText>
          </View>

          <View style={styles.progressBody}>
            <View style={styles.progressVisual}>
              <Companion
                placement="home"
                phase={companionState.phase}
                evolutionTier={profile.evolutionTier}
                calmness={companionState.calmness}
                state={companionState}
              />
            </View>

            <View style={styles.progressCopy}>
              <MinimalText variant="body">
                {profile.totalSessions} sessões concluídas e {profile.totalMinutes} minutos acumulados.
              </MinimalText>
              <MinimalText
                variant="caption"
                color={colors.textSecondary}
                style={styles.progressText}
              >
                Melhor sequência: {profile.bestStreak} dias - multiplicador atual {profile.streakMultiplier.toFixed(2)}x
              </MinimalText>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.max(profile.progressWithinLevel * 100, 6)}%` },
                  ]}
                />
              </View>
              <MinimalText variant="caption" color={colors.textSecondary}>
                {profile.nextLevelLabel
                  ? `${profile.xpToNextLevel} XP para ${profile.nextLevelLabel}`
                  : 'Evolução integrada, sem regressão visual brusca.'}
              </MinimalText>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <StatsCard stats={stats} />
      </View>

      {sessions.length > 0 && (
        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Sessões recentes
        </MinimalText>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <MinimalText variant="body" color={colors.textSecondary} align="center">
        Nenhuma sessão registrada ainda.
      </MinimalText>
      <MinimalText variant="caption" color={colors.textSecondary} align="center">
        Complete sua primeira sessão para ver seu progresso.
      </MinimalText>
    </View>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SessionListItem session={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  progressCard: {
    borderRadius: borderRadius.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressVisual: {
    width: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCopy: {
    flex: 1,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  progressText: {
    marginTop: spacing.xs,
  },
  empty: {
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
});
