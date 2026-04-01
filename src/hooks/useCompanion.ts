import { useMemo } from 'react';
import type { SessionPhase } from '../types/session';
import {
  getCompanionState,
  type CompanionPlacement,
  type CompanionRenderMode,
} from '../services/companionEngine';
import { useGamification } from './useGamification';

interface UseCompanionOptions {
  placement: CompanionPlacement;
  currentPhase?: SessionPhase;
  preferredMode?: CompanionRenderMode;
}

export function useCompanion({
  placement,
  currentPhase,
  preferredMode = 'image',
}: UseCompanionOptions) {
  const { stats, profile } = useGamification();

  const companionState = useMemo(
    () =>
      getCompanionState({
        streak: stats.currentStreak,
        sessionsCompleted: stats.totalSessions,
        sessionsToday: stats.sessionsToday,
        currentPhase,
        evolutionTier: profile.evolutionTier,
        placement,
        preferredMode,
      }),
    [
      currentPhase,
      placement,
      preferredMode,
      profile.evolutionTier,
      stats.currentStreak,
      stats.sessionsToday,
      stats.totalSessions,
    ]
  );

  return {
    stats,
    profile,
    companionState,
  };
}
