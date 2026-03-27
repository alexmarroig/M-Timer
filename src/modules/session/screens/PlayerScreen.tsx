import React, { useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTimerEngine } from '../hooks/useTimerEngine';
import { TimelineProgress } from '../components/TimelineProgress';
import { PhaseIndicator } from '../components/PhaseIndicator';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing } from '../../../core/theme';
import { formatTime, totalPhaseDuration } from '../../../core/utils/time';
import { PHASE_LABELS } from '../../../types/session';
import { useHistoryStore } from '../../../store/historyStore';
import { useUserStore } from '../../../store/userStore';
import { useCompanionStore } from '../../../store/companionStore';
import { CompanionPet } from '../components/CompanionPet';
import type { SessionStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<SessionStackParamList, 'Player'>;

export function PlayerScreen({ route, navigation }: Props) {
  const { template } = route.params;
  const showTimer = useUserStore((s) => s.showTimer);
  const addSession = useHistoryStore((s) => s.addSession);
  const getStats = useHistoryStore((s) => s.getStats);
  const grantSessionReward = useCompanionStore((s) => s.grantSessionReward);
  const mood = useCompanionStore((s) => s.mood);
  const level = useCompanionStore((s) => s.level);
  const coins = useCompanionStore((s) => s.coins);
  const xp = useCompanionStore((s) => s.xp);
  const lastRewardXp = useCompanionStore((s) => s.lastRewardXp);
  const lastRewardCoins = useCompanionStore((s) => s.lastRewardCoins);
  const rewardSentRef = useRef(false);

  const {
    state,
    currentPhase,
    phases,
    phaseRemaining,
    totalElapsed,
    totalDuration,
    phaseProgress,
    isActive,
    isPaused,
    isFinished,
    sessionStartTimestamp,
    start,
    pause,
    resume,
    reset,
  } = useTimerEngine();

  // Start session on mount
  useEffect(() => {
    if (state === 'idle') {
      start(template.phases);
    }
  }, []);

  // Save session when finished
  useEffect(() => {
    if (isFinished && sessionStartTimestamp > 0 && !rewardSentRef.current) {
      rewardSentRef.current = true;
      addSession({
        templateId: template.id,
        templateName: template.name,
        phases: template.phases,
        startedAt: sessionStartTimestamp,
        completed: true,
      });

      const streak = getStats().currentStreak;
      grantSessionReward(totalPhaseDuration(template.phases), streak);
    }
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);

  const handleClose = useCallback(() => {
    reset();
    navigation.goBack();
  }, [reset, navigation]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isPaused, pause, resume]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <ButtonPrimary
          title={isFinished ? 'Fechar' : 'Sair'}
          onPress={handleClose}
          variant="ghost"
          size="small"
        />
        <MinimalText variant="caption" color={colors.textSecondary}>
          {template.name}
        </MinimalText>
        <View style={{ width: 60 }} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {isFinished ? (
          <View style={styles.finishedContainer}>
            <MinimalText variant="heading" align="center" color={colors.primary}>
              Sessão completa
            </MinimalText>
            <MinimalText
              variant="body"
              align="center"
              color={colors.textSecondary}
              style={{ marginTop: spacing.md }}
            >
              {formatTime(totalDuration)} de prática
            </MinimalText>
            <View style={styles.finishedPet}>
              <CompanionPet
                mood={mood}
                level={level}
                coins={coins}
                xp={xp}
                lastRewardXp={lastRewardXp}
                lastRewardCoins={lastRewardCoins}
              />
            </View>
            <ButtonPrimary
              title="Concluir"
              onPress={handleClose}
              size="large"
              style={{ marginTop: spacing.xl }}
            />
          </View>
        ) : (
          <>
            {/* Phase indicator */}
            <PhaseIndicator currentPhase={currentPhase} state={state} />

            {/* Timer display */}
            {showTimer && (
              <View style={styles.timerContainer}>
                <MinimalText variant="timer" align="center" color={colors.primary}>
                  {formatTime(phaseRemaining)}
                </MinimalText>
                <MinimalText variant="caption" align="center" color={colors.textSecondary}>
                  {formatTime(totalDuration - totalElapsed)} restante
                </MinimalText>
              </View>
            )}

            {!showTimer && (
              <View style={styles.timerContainer}>
                <MinimalText variant="subheading" align="center" color={colors.textSecondary}>
                  {PHASE_LABELS[currentPhase]}
                </MinimalText>
              </View>
            )}
          </>
        )}
      </View>

      {/* Timeline */}
      <View style={styles.timelineContainer}>
        <TimelineProgress phases={phases} progress={phaseProgress} />
        <View style={styles.phaseLabels}>
          <MinimalText variant="caption" color={colors.rampUp}>Entrada</MinimalText>
          <MinimalText variant="caption" color={colors.core}>Meditação</MinimalText>
          <MinimalText variant="caption" color={colors.cooldown}>Saída</MinimalText>
        </View>
      </View>

      {/* Controls */}
      {isActive && (
        <View style={styles.controls}>
          <ButtonPrimary
            title={isPaused ? 'Retomar' : 'Pausar'}
            onPress={handlePauseResume}
            variant={isPaused ? 'primary' : 'secondary'}
            size="large"
            style={styles.controlButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  timerContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  finishedContainer: {
    alignItems: 'center',
  },
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
  },
  timelineContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  phaseLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  controls: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  controlButton: {
    width: '100%',
  },
});
