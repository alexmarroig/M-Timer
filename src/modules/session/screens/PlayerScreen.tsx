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
import { colors, spacing } from '../../../core/theme';
import { formatTime } from '../../../core/utils/time';
import { PHASE_LABELS } from '../../../types/session';
import { getSessionExpression } from '../../../types/companion';
import { useHistoryStore } from '../../../store/historyStore';
import { useCompanionStore } from '../../../store/companionStore';
import { useUserStore } from '../../../store/userStore';
import type { SessionStackParamList } from '../../../core/navigation/types';
import { useSessionCues } from '../hooks/useSessionCues';

type Props = NativeStackScreenProps<SessionStackParamList, 'Player'>;

export function PlayerScreen({ route, navigation }: Props) {
  const canExitRef = useRef(false);
  const { template } = route.params;
  const showTimer = useUserStore((s) => s.showTimer);
  const addSession = useHistoryStore((s) => s.addSession);
  const addSessionXp = useCompanionStore((s) => s.addSessionXp);
  const showTimer = useUserStore((state) => state.showTimer);
  const ambientMuted = useUserStore((state) => state.ambientMuted);
  const addSession = useHistoryStore((state) => state.addSession);
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

  // Save session when finished + award XP
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
      // Award XP - need fresh stats after adding session
      const freshStats = useHistoryStore.getState().getStats();
      addSessionXp(freshStats.currentStreak, freshStats.sessionsToday);
    }
  }, [addSession, isFinished, sessionStartTimestamp, template]);

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
    const isSessionInProgress = !isFinished && (isActive || isPaused || state !== 'idle');

    if (isSessionInProgress) {
      confirmExit(exitSession);
      return;
    }

    exitSession();
  }, [confirmExit, exitSession, isActive, isFinished, isPaused, state]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      resume();
      return;
    }

    pause();
  }, [isPaused, pause, resume]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (canExitRef.current || isFinished || state === 'idle') {
        return;
      }

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
            <CompanionCharacter
              sessionExpression="finished"
              size={100}
            />
            <MinimalText
              variant="heading"
              align="center"
              color={colors.primary}
              style={{ marginTop: spacing.lg }}
            >
              Sessão completa
            <MinimalText variant="heading" align="center" color={colors.primary}>
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
              {profile.nextLevelLabel ? ` - ${profile.xpToNextLevel} XP para ${profile.nextLevelLabel}` : ''}
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
            {/* Companion reacting to phase */}
            <CompanionCharacter
              sessionExpression={getSessionExpression(state, currentPhase)}
              size={state === 'core' ? 80 : 100}
            />

            {/* Phase indicator */}
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

            <PhaseIndicator currentPhase={currentPhase} state={state} />

            {showTimer ? (
              <View style={styles.timerContainer}>
                <MinimalText variant="timer" align="center" color={colors.primary}>
                  {formatTime(phaseRemaining)}
                </MinimalText>
                <MinimalText variant="caption" align="center" color={colors.textSecondary}>
                  {formatTime(totalDuration - totalElapsed)} restante
                </MinimalText>
                <MinimalText variant="caption" align="center" color={colors.textSecondary}>
                  Companion {profile.levelLabel.toLowerCase()} - {profile.xpTotal} XP
                </MinimalText>
                {ambientMuted && (
                  <MinimalText variant="caption" align="center" color={colors.error}>
                    Sem som ambiente (mute ativo)
                  </MinimalText>
                )}
              </View>
            ) : (
              <View style={styles.timerContainer}>
                <MinimalText variant="subheading" align="center" color={colors.textSecondary}>
                  {PHASE_LABELS[currentPhase]}
                </MinimalText>
                <MinimalText variant="caption" align="center" color={colors.textSecondary}>
                  {profile.xpTotal} XP - melhor streak {profile.bestStreak}
                </MinimalText>
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.timelineContainer}>
        <TimelineProgress phases={phases} progress={phaseProgress} />
        <View style={styles.phaseLabels}>
          <MinimalText variant="caption" color={colors.rampUp}>
            Entrada
          </MinimalText>
          <MinimalText variant="caption" color={colors.core}>
            Meditacao
          </MinimalText>
          <MinimalText variant="caption" color={colors.cooldown}>
            Saida
          </MinimalText>
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
    marginBottom: spacing.lg,
  },
  timerContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  finishedContainer: {
    alignItems: 'center',
  },
  finishedText: {
    marginTop: spacing.md,
  },
  finishedLevel: {
    marginTop: spacing.md,
  },
  finishButton: {
    marginTop: spacing.xl,
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
