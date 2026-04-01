import React, { useCallback } from 'react';
import { View, Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { CompanionFace } from './CompanionFace';
import { useCompanionAnimations } from './useCompanionAnimations';
import { useCompanionStore } from '../../store/companionStore';
import { useHistoryStore } from '../../store/historyStore';
import { MinimalText } from '../../components/ui/MinimalText';
import { colors, spacing } from '../../core/theme';
import {
  CompanionMood,
  SessionExpression,
  getMoodFromStreak,
  getFaceExpression,
  getLevelFromXp,
  getXpProgress,
} from '../../types/companion';

interface Props {
  /** Override mood for session screen. If not provided, calculates from streak */
  sessionExpression?: SessionExpression;
  /** Size of the companion body */
  size?: number;
  /** Show level/XP info below */
  showLevel?: boolean;
  /** Callback when tapped */
  onPress?: () => void;
}

export function CompanionCharacter({
  sessionExpression = 'idle',
  size = 120,
  showLevel = false,
  onPress,
}: Props) {
  const xp = useCompanionStore((s) => s.xp);
  const stats = useHistoryStore((s) => s.getStats());
  const mood = getMoodFromStreak(stats.currentStreak);
  const expression = getFaceExpression(mood, sessionExpression);
  const level = getLevelFromXp(xp);
  const progress = getXpProgress(xp);

  const {
    floatY,
    scale,
    glowOpacity,
    rotation,
    bounceY,
    triggerBounce,
  } = useCompanionAnimations(mood, sessionExpression);

  const handlePress = useCallback(() => {
    triggerBounce();
    onPress?.();
  }, [triggerBounce, onPress]);

  // Glow intensity based on mood/level
  const glowSize = size * 0.15 + level.level * 4;
  const bodyColor = '#FFF5E1';
  const glowColor = level.level >= 4 ? '#C9A84C' : '#FFE4B5';

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.wrapper}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                { translateY: Animated.add(floatY, bounceY) },
                { scale },
                { rotate: rotation },
              ],
            },
          ]}
        >
          {/* Glow layer */}
          <Animated.View
            style={[
              styles.glow,
              {
                width: size + glowSize * 2,
                height: size + glowSize * 2,
                borderRadius: (size + glowSize * 2) / 2,
                backgroundColor: glowColor,
                opacity: glowOpacity,
                top: -glowSize,
                left: -glowSize,
              },
            ]}
          />

          {/* Body */}
          <View
            style={[
              styles.body,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: bodyColor,
                shadowColor: glowColor,
                shadowRadius: glowSize,
              },
            ]}
          >
            {/* Level 4+ golden rim */}
            {level.level >= 4 && (
              <View
                style={[
                  styles.goldenRim,
                  {
                    width: size + 4,
                    height: size + 4,
                    borderRadius: (size + 4) / 2,
                  },
                ]}
              />
            )}

            {/* Level 5 halo */}
            {level.level >= 5 && (
              <View
                style={[
                  styles.halo,
                  {
                    width: size * 0.5,
                    height: size * 0.15,
                    borderRadius: size * 0.075,
                    top: -size * 0.12,
                  },
                ]}
              />
            )}

            <CompanionFace expression={expression} size={size} />
          </View>
        </Animated.View>

        {/* Level info */}
        {showLevel && (
          <View style={styles.levelInfo}>
            <MinimalText variant="caption" align="center" color={colors.accent}>
              {level.name} · Nv. {level.level}
            </MinimalText>
            {/* XP progress bar */}
            <View style={styles.xpBarContainer}>
              <View style={[styles.xpBarFill, { width: `${Math.min(100, progress * 100)}%` }]} />
            </View>
            <MinimalText variant="caption" align="center" color={colors.textSecondary} style={{ fontSize: 11 }}>
              {xp} XP
            </MinimalText>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    elevation: 8,
  },
  goldenRim: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#C9A84C',
    top: -2,
    left: -2,
  },
  halo: {
    position: 'absolute',
    backgroundColor: '#C9A84C',
    opacity: 0.6,
    alignSelf: 'center',
  },
  levelInfo: {
    marginTop: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  xpBarContainer: {
    width: 100,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
});
