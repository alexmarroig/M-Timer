import React, { useEffect, useCallback, useRef } from 'react';
import { Alert, View, StyleSheet, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTimerEngine } from '../hooks/useTimerEngine';
import { TimelineProgress } from '../components/TimelineProgress';
import { PhaseIndicator } from '../components/PhaseIndicator';
import { CompanionCharacter } from '../../companion/CompanionCharacter';

import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { MinimalText } from '../../../components/ui/MinimalText';
import { Companion } from '../../../components/Companion';

import { useCompanion } from '../../../hooks/useCompanion';
import { useMeditationAudio } from '../../../hooks/useMeditationAudio';
import { useSessionCues } from '../hooks/useSessionCues';

import { colors, spacing } from '../../../core/theme';
import { formatTime } from '../../../core/utils/time';
import { PHASE_LABELS } from '../../../types/session';
import { getSessionExpression } from '../../../types/companion';

import { useHistoryStore } from '../../../store/historyStore';
import { useCompanionStore } from '../../../store/companionStore';
import { useUserStore } from '../../../store/userStore';
import type { SessionStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<SessionStackParamList, 'Player'>;

export function PlayerScreen({ route, navigation }: Props) {
  const canExitRef = useRef(false);
  const rewardSentRef = useRef(false);

  const { template } = route.params;

  const showTimer = useUserStore((state) => state.showTimer);
  const ambientMuted = useUserStore((state) => state.ambientMuted);

  const addSession = useHistoryStore((state) => state.addSession);
  const addSessionXp = useCompanionStore((state) => state.addSessionXp);

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

  const playerPhase = isFinished ? 'cooldown' : currentPhase;

  const { profile, companionState } = useCompanion({
    placement: 'player',
    currentPhase: playerPhase,
  });

  useSessionCues(currentPhase, state);
  useMeditationAudio({ currentPhase, state });

  useEffect(() => {
    if (state === 'idle') {
      start(template.phases);
    }
  }, [start, state, template.phases]);

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

      const freshStats = useHistoryStore.getState().getStats();
      addSessionXp(freshStats.currentStreak, freshStats.sessionsToday);
    }
  }, [addSession, addSessionXp, isFinished, sessionStartTimestamp, template]);

  const exitSession = useCallback(() => {
    canExitRef.current = true;
    reset();
    navigation.goBack();
  }, [navigation, reset]);

  const confirmExit = useCallback((onExit: () => void) => {
    Alert.alert(
      'Abandonar sessao?',
      'Se voce sair agora, esta pratica nao sera salva como concluida.',
      [
        { text: 'Continuar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: onExit },
      ]
    );
  }, []);

  const handleClose = useCallback(() => {
    const inProgress = !isFinished && (isActive || isPaused || state !== 'idle');

    if (inProgress) {
      confirmExit(exitSession);
      return;
    }

    exitSession();
  }, [confirmExit, exitSession, isActive, isFinished, isPaused, state]);

  const handlePauseResume = useCallback(() => {
    isPaused ? resume() : pause();
  }, [isPaused, pause, resume]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (canExitRef.current || isFinished || state === 'idle') return;

      event.preventDefault();

      confirmExit(() => {
        canExitRef.current = true;
        reset();
        navigation.dispatch(event.data.action);
      });
    });

    return unsubscribe;
  }, [confirmExit, isFinished, navigation, reset, state]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {isFinished ? (
          <View style={styles.finishedContainer}>
            <CompanionCharacter sessionExpression="finished" size={100} />

            <MinimalText
              variant="heading"
              align="center"
              color={colors.primary}
              style={{ marginTop: spacing.lg }}
            >
              Sessao completa
            </MinimalText>

            <MinimalText
              variant="body"
              align="center"
              color={colors.textSecondary}
              style={styles.finishedText}
            >
              {formatTime(totalDuration)} de pratica
            </MinimalText>

            <View style={styles.companionContainer}>
              <Companion
                placement="player"
                phase={companionState.phase}
                evolutionTier={profile.evolutionTier}
                calmness={companionState.calmness}
                state={companionState}
              />
            </View>

            <MinimalText
              variant="subheading"
              align="center"
              color={colors.primary}
              style={styles.finishedLevel}
            >
              Nivel {profile.currentLevel} - {profile.levelLabel}
            </MinimalText>

            <MinimalText variant="caption" align="center" color={colors.textSecondary}>
              {profile.xpTotal} XP acumulado
              {profile.nextLevelLabel
                ? ` - ${profile.xpToNextLevel} XP para ${profile.nextLevelLabel}`
                : ''}
            </MinimalText>

            <ButtonPrimary
              title="Concluir"
              onPress={handleClose}
              size="large"
              style={styles.finishButton}
            />
          </View>
        ) : (
          <>
            <CompanionCharacter
              sessionExpression={getSessionExpression(state, currentPhase)}
              size={state === 'core' ? 80 : 100}
            />

            <View style={{ marginTop: spacing.md }}>
              <PhaseIndicator currentPhase={currentPhase} state={state} />
            </View>

            <View style={styles.companionContainer}>
              <Companion
                placement="player"
                phase={companionState.phase}
                evolutionTier={profile.evolutionTier}
                calmness={companionState.calmness}
                state={companionState}
              />
            </View>

            {showTimer ? (
              <View style={styles.timerContainer}>
                <MinimalText variant="timer" align="center" color={colors.primary}>
                  {formatTime(phaseRemaining)}
                </MinimalText>

                <View style={styles.timerMeta}>
                  <MinimalText variant="caption" align="center" color={colors.textSecondary}>
                    {formatTime(totalDuration - totalElapsed)} restante
                  </MinimalText>

                  <View style={styles.xpBadge}>
                    <MinimalText variant="caption" align="center" color={colors.accent} style={{ fontWeight: '700' }}>
                      +{profile.xpTotal} XP
                    </MinimalText>
                  </View>
                </View>

                {ambientMuted && (
                  <MinimalText variant="caption" align="center" color={colors.textSecondary} style={{ opacity: 0.6 }}>
                    Som ambiente pausado
                  </MinimalText>
                )}
              </View>
            ) : (
              <View style={styles.timerContainer}>
                <View style={styles.phaseGlass}>
                  <MinimalText variant="subheading" align="center" color={colors.primary} style={{ fontWeight: '700' }}>
                    {PHASE_LABELS[currentPhase].toUpperCase()}
                  </MinimalText>
                </View>

                <MinimalText variant="caption" align="center" color={colors.textSecondary}>
                   Melhor streak: {profile.bestStreak} dias
                </MinimalText>
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.timelineContainer}>
        <TimelineProgress phases={phases} progress={phaseProgress} />

        <View style={styles.phaseLabels}>
          <MinimalText variant="caption" color={colors.rampUp}>Entrada</MinimalText>
          <MinimalText variant="caption" color={colors.core}>Meditacao</MinimalText>
          <MinimalText variant="caption" color={colors.cooldown}>Saida</MinimalText>
        </View>
      </View>

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
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  companionContainer: {
    marginBottom: spacing.xl,
  },
  timerContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  timerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  xpBadge: {
    backgroundColor: 'rgba(166, 124, 0, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 99,
  },
  phaseGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  finishedContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.xxl,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  finishedText: {
    marginTop: spacing.xs,
    opacity: 0.8,
  },
  finishedLevel: {
    marginTop: spacing.lg,
    fontWeight: '700',
  },
  finishButton: {
    marginTop: spacing.xxl,
    width: '100%',
  },
  timelineContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  phaseLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  controls: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  controlButton: {
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
