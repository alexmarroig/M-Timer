import type { SessionPhase } from '../types/session';
import type { EvolutionTier } from './gamificationEngine';

export type CompanionPlacement = 'home' | 'player';
export type CompanionRenderMode = 'image' | 'video';

export interface CompanionStateInput {
  streak: number;
  sessionsCompleted: number;
  sessionsToday: number;
  currentPhase?: SessionPhase;
  evolutionTier: EvolutionTier;
  placement: CompanionPlacement;
  preferredMode?: CompanionRenderMode;
}

export interface CompanionState {
  phase: SessionPhase;
  breathingRange: [number, number];
  floatRange: [number, number];
  glowOpacityRange: [number, number];
  brightness: number;
  calmness: number;
  renderMode: CompanionRenderMode;
  cycleDurationMs: number;
  sizeBoost: number;
  baseOpacity: number;
}

const PHASE_PRESETS: Record<
  SessionPhase,
  {
    breathingRange: [number, number];
    floatRange: [number, number];
    glowOpacityRange: [number, number];
    cycleDurationMs: number;
    baseOpacity: number;
  }
> = {
  rampUp: {
    breathingRange: [0.965, 1.035],
    floatRange: [-6, 6],
    glowOpacityRange: [0.2, 0.46],
    cycleDurationMs: 3200,
    baseOpacity: 1,
  },
  core: {
    breathingRange: [0.99, 1.01],
    floatRange: [-2, 2],
    glowOpacityRange: [0.12, 0.24],
    cycleDurationMs: 4800,
    baseOpacity: 1,
  },
  cooldown: {
    breathingRange: [0.98, 1.04],
    floatRange: [-3, 3],
    glowOpacityRange: [0.14, 0.28],
    cycleDurationMs: 4400,
    baseOpacity: 0.82,
  },
};

const EVOLUTION_VISUALS: Record<
  EvolutionTier,
  {
    glowBoost: number;
    brightnessBoost: number;
    sizeBoost: number;
    durationBoostMs: number;
  }
> = {
  beginner: {
    glowBoost: 0,
    brightnessBoost: 0,
    sizeBoost: 0,
    durationBoostMs: 0,
  },
  stabilizing: {
    glowBoost: 0.03,
    brightnessBoost: 0.03,
    sizeBoost: 0.02,
    durationBoostMs: 120,
  },
  deepening: {
    glowBoost: 0.05,
    brightnessBoost: 0.05,
    sizeBoost: 0.04,
    durationBoostMs: 220,
  },
  consistent: {
    glowBoost: 0.07,
    brightnessBoost: 0.08,
    sizeBoost: 0.06,
    durationBoostMs: 320,
  },
  integrated: {
    glowBoost: 0.09,
    brightnessBoost: 0.1,
    sizeBoost: 0.08,
    durationBoostMs: 420,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function getCompanionState({
  streak,
  sessionsCompleted,
  sessionsToday,
  currentPhase,
  evolutionTier,
  placement,
  preferredMode = 'image',
}: CompanionStateInput): CompanionState {
  const phase = placement === 'home' ? 'core' : currentPhase ?? 'core';
  const preset = PHASE_PRESETS[phase];
  const evolution = EVOLUTION_VISUALS[evolutionTier];
  const placementSoftness = placement === 'home' ? 0.82 : 1;
  const habitStrength = clamp(sessionsCompleted / 40, 0, 1);
  const streakStrength = clamp(streak / 10, 0, 1);
  const dailyCadence = clamp(sessionsToday / 2, 0, 1);
  const calmness = clamp(
    0.42 + habitStrength * 0.24 + streakStrength * 0.22 + dailyCadence * 0.12,
    0.38,
    0.98
  );

  return {
    phase,
    breathingRange: [
      round(1 + (preset.breathingRange[0] - 1) * placementSoftness),
      round(1 + (preset.breathingRange[1] - 1) * placementSoftness + evolution.sizeBoost * 0.08),
    ],
    floatRange: [
      round(preset.floatRange[0] * placementSoftness),
      round(preset.floatRange[1] * placementSoftness),
    ],
    glowOpacityRange: [
      round(preset.glowOpacityRange[0] + evolution.glowBoost * 0.6),
      round(preset.glowOpacityRange[1] + evolution.glowBoost),
    ],
    brightness: clamp(0.9 + calmness * 0.08 + evolution.brightnessBoost, 0.9, 1.08),
    calmness,
    renderMode: preferredMode,
    cycleDurationMs: Math.round(preset.cycleDurationMs + evolution.durationBoostMs),
    sizeBoost: round(evolution.sizeBoost * (placement === 'home' ? 0.75 : 1)),
    baseOpacity: preset.baseOpacity,
  };
}
