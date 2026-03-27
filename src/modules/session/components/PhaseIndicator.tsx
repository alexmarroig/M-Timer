import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SessionPhase, PHASE_LABELS, TimerState } from '../../../types/session';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing } from '../../../core/theme';

interface Props {
  currentPhase: SessionPhase;
  state: TimerState;
}

const PHASE_DESCRIPTIONS: Record<SessionPhase, string> = {
  rampUp: 'Respire devagar. Deixe o corpo relaxar.',
  core: 'Permita que o mantra venha sem esforço.',
  cooldown: 'Olhos fechados. Volte devagar.',
};

const PHASE_COLORS: Record<SessionPhase, string> = {
  rampUp: colors.rampUp,
  core: colors.core,
  cooldown: colors.cooldown,
};

export function PhaseIndicator({ currentPhase, state }: Props) {
  if (state === 'idle' || state === 'finished') return null;

  const label = state === 'paused' ? 'Pausado' : PHASE_LABELS[currentPhase];
  const description = PHASE_DESCRIPTIONS[currentPhase];
  const phaseColor = PHASE_COLORS[currentPhase];

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: phaseColor }]} />
      <MinimalText variant="subheading" align="center" color={phaseColor}>
        {label}
      </MinimalText>
      <MinimalText
        variant="caption"
        align="center"
        color={colors.textSecondary}
        style={styles.description}
      >
        {description}
      </MinimalText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  description: {
    maxWidth: 240,
  },
});
