import React, { useEffect, useCallback, useRef } from 'react';
import { Alert, View, StyleSheet, StatusBar, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTimerEngine } from '../hooks/useTimerEngine';
import { TimelineProgress } from '../components/TimelineProgress';
import { PhaseIndicator } from '../components/PhaseIndicator';
import { CompanionCharacter } from '../../companion/CompanionCharacter';
import { SessionBackground } from '../components/SessionBackground';

import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { MinimalText } from '../../../components/ui/MinimalText';

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
  // Mantém a tela ativa durante toda a sessão de meditação
  useKeepAwake();

  const canExitRef = useRef(false);
  const rewardSentRef = useRef(false);
  const xpFloatY = useRef(new Animated.Value(0)).current;
  const xpFloatOpacity = useRef(new Animated.Value(0)).current;
  const xpGainRef = useRef(0);
  const celebrateScale = useRef(new Animated.Value(1)).current;
  const milestoneMessageRef = useRef('');

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

      // XP float animation
      const earnedXp = 10 + Math.round(template.phases.core / 60) + Math.min(20, freshStats.currentStreak * 2);
      xpGainRef.current = earnedXp;
      xpFloatY.setValue(0);
      xpFloatOpacity.setValue(0);
      Animated.sequence([
        Animated.timing(xpFloatOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(xpFloatY, { toValue: -80, duration: 1400, useNativeDriver: true }),
        Animated.timing(xpFloatOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      // Celebração especial para milestones de sequência
      const streak = freshStats.currentStreak;
      if (streak === 7) {
        milestoneMessageRef.current = '🔥 7 dias seguidos! Incrível!';
      } else if (streak === 30) {
        milestoneMessageRef.current = '🌟 30 dias! Você é consistente!';
      } else if (streak === 100) {
        milestoneMessageRef.current = '💎 100 dias! Mestre da meditação!';
      } else if (streak > 0 && streak % 10 === 0) {
        milestoneMessageRef.current = `🎯 ${streak} dias de constância!`;
      } else {
        milestoneMessageRef.current = '';
      }

      if (milestoneMessageRef.current) {
        // Haptic burst duplo para milestones
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}), 600);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}), 900);
        // Animação de pulso no ícone de conclusão
        Animated.sequence([
          Animated.spring(celebrateScale, { toValue: 1.25, useNativeDriver: true, speed: 20, bounciness: 10 }),
          Animated.spring(celebrateScale, { toValue: 1, useNativeDriver: true, speed: 10, bounciness: 4 }),
        ]).start();
      }
    }
  }, [addSession, addSessionXp, celebrateScale, isFinished, sessionStartTimestamp, template, xpFloatY, xpFloatOpacity]);

  const exitSession = useCallback(() => {
    canExitRef.current = true;
    reset();
    navigation.goBack();
  }, [navigation, reset]);

  const confirmExit = useCallback((onExit: () => void) => {
    Alert.alert(
      'Abandonar sessão?',
      'Se você sair agora, esta prática não será salva como concluída.',
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

  // Background state: use 'finished' when done, otherwise use timer state
  const bgState = isFinished ? 'finished' : state;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Animated background — renders behind everything */}
      <SessionBackground state={bgState} />

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
          <>
          <View style={styles.finishedContainer}>
            <Animated.View style={{ transform: [{ scale: celebrateScale }] }}>
              <CompanionCharacter sessionExpression="finished" size={100} />
            </Animated.View>

            <MinimalText
              variant="heading"
              align="center"
              color={colors.primary}
              style={{ marginTop: spacing.lg }}
            >
              Sessão completa 🎉
            </MinimalText>

            {milestoneMessageRef.current ? (
              <MinimalText
                variant="subheading"
                align="center"
                color={colors.accent}
                style={{ marginTop: spacing.sm }}
              >
                {milestoneMessageRef.current}
              </MinimalText>
            ) : null}

            <MinimalText
              variant="body"
              align="center"
              color={colors.textSecondary}
              style={styles.finishedText}
            >
              {formatTime(totalDuration)} de prática
            </MinimalText>

            <MinimalText
              variant="subheading"
              align="center"
              color={colors.primary}
              style={styles.finishedLevel}
            >
              Nível {profile.currentLevel} - {profile.levelLabel}
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

          {/* Floating XP indicator */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.xpFloat,
              { opacity: xpFloatOpacity, transform: [{ translateY: xpFloatY }] },
            ]}
          >
            <MinimalText variant="subheading" color={colors.accent} align="center">
              +{xpGainRef.current} XP ✨
            </MinimalText>
          </Animated.View>
          </>
        ) : (
          <>
            <CompanionCharacter
              sessionExpression={getSessionExpression(state, currentPhase)}
              size={state === 'core' ? 80 : 100}
            />

            <View style={{ marginTop: spacing.md }}>
              <PhaseIndicator currentPhase={currentPhase} state={state} />
            </View>

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
                  {profile.xpTotal} XP - melhor sequência {profile.bestStreak}
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
          <MinimalText variant="caption" color={colors.core}>Meditação</MinimalText>
          <MinimalText variant="caption" color={colors.cooldown}>Saída</MinimalText>
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
    backgroundColor: 'transparent',
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
  xpFloat: {
    position: 'absolute',
    bottom: 180,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
});
