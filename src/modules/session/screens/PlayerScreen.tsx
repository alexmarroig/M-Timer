import React, { useEffect, useCallback, useRef } from 'react';
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
import { Alert, View, StyleSheet, StatusBar } from 'react-native';
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
import { View, StyleSheet, StatusBar } from 'react-native';
>>>>>>> theirs
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTimerEngine } from '../hooks/useTimerEngine';
import { TimelineProgress } from '../components/TimelineProgress';
import { PhaseIndicator } from '../components/PhaseIndicator';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { MinimalText } from '../../../components/ui/MinimalText';
import { Companion } from '../../../components/Companion';
import { useCompanion } from '../../../hooks/useCompanion';
import { useMeditationAudio } from '../../../hooks/useMeditationAudio';
import { colors, spacing } from '../../../core/theme';
import { formatTime } from '../../../core/utils/time';
import { PHASE_LABELS } from '../../../types/session';
import { useHistoryStore } from '../../../store/historyStore';
import { useUserStore } from '../../../store/userStore';
import { useCompanionStore } from '../../../store/companionStore';
import { CompanionPet } from '../components/CompanionPet';
import type { SessionStackParamList } from '../../../core/navigation/types';
import { useSessionCues } from '../hooks/useSessionCues';

type Props = NativeStackScreenProps<SessionStackParamList, 'Player'>;

export function PlayerScreen({ route, navigation }: Props) {
  const canExitRef = useRef(false);
  const { template } = route.params;
<<<<<<< ours
  const showTimer = useUserStore((state) => state.showTimer);
  const ambientMuted = useUserStore((state) => state.ambientMuted);
  const addSession = useHistoryStore((state) => state.addSession);
=======
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
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
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
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
  }, [addSession, isFinished, sessionStartTimestamp, template]);
=======
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);
>>>>>>> theirs
=======
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);
>>>>>>> theirs
=======
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);
>>>>>>> theirs
=======
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);
>>>>>>> theirs
=======
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);
>>>>>>> theirs
=======
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);
>>>>>>> theirs
=======
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);
>>>>>>> theirs
=======
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);
>>>>>>> theirs
=======
  }, [isFinished, sessionStartTimestamp, addSession, template, getStats, grantSessionReward]);
>>>>>>> theirs

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
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours

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
<<<<<<< ours
<<<<<<< ours
            <MinimalText variant="caption" align="center" color={colors.textSecondary}>
              {profile.xpTotal} XP acumulado
              {profile.nextLevelLabel ? ` - ${profile.xpToNextLevel} XP para ${profile.nextLevelLabel}` : ''}
            </MinimalText>
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours

=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
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
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
            <ButtonPrimary
              title="Concluir"
              onPress={handleClose}
              size="large"
              style={styles.finishButton}
            />
          </View>
        ) : (
          <>
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
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
  finishedText: {
    marginTop: spacing.md,
  },
  finishedLevel: {
    marginTop: spacing.md,
  },
  finishButton: {
    marginTop: spacing.xl,
=======
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
>>>>>>> theirs
=======
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
>>>>>>> theirs
=======
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
>>>>>>> theirs
=======
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
>>>>>>> theirs
=======
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
>>>>>>> theirs
=======
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
>>>>>>> theirs
=======
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
>>>>>>> theirs
=======
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
>>>>>>> theirs
=======
  finishedPet: {
    marginTop: spacing.lg,
    width: '100%',
>>>>>>> theirs
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
