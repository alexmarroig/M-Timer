import React, { useCallback, useMemo } from 'react';
import { View, Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { CompanionFace } from './CompanionFace';
import { useCompanionAnimations } from './useCompanionAnimations';
import { useCompanionStore } from '../../store/companionStore';
import { MinimalText } from '../../components/ui/MinimalText';
import { colors, spacing } from '../../core/theme';
import {
  SessionExpression,
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
  const mood = useCompanionStore((s) => s.mood);

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

  // Visuals based on mood/level
  const isSad = mood === 'sad' || mood === 'neglected';

  // Glow intensity based on mood/level
  const glowSize = size * 0.15 + level.level * 5;

  // Color logic
  let bodyColor = level.level >= 2 ? '#FFF9ED' : '#FFF5E1';
  let glowColor = level.level >= 4 ? '#C9A84C' : '#FFE4B5';

  if (mood === 'sad') {
    bodyColor = '#F0F0F0';
    glowColor = '#D0D0D0';
  } else if (mood === 'neglected') {
    bodyColor = '#E0E0E0';
    glowColor = '#B0B0B0';
  }

  // Level 3+ Particles
  const particles = useMemo(() => {
    if (level.level < 3 || isSad) return null;
    return [0, 1, 2].map((i) => {
      const angle = (i * 120 * Math.PI) / 180;
      const radius = size * 0.65;
      return (
        <View
          key={i}
          style={[
            styles.particle,
            {
              top: size / 2 + Math.sin(angle) * radius - 3,
              left: size / 2 + Math.cos(angle) * radius - 3,
              opacity: 0.6 + i * 0.1,
            },
          ]}
        />
      );
    });
  }, [level.level, size, isSad]);

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
                opacity: level.level >= 3 ? Animated.multiply(glowOpacity, 1.2) : glowOpacity,
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
                borderWidth: level.level >= 2 ? 1 : 0,
                borderColor: level.level >= 2 ? 'rgba(255,255,255,0.8)' : 'transparent',
              },
            ]}
          >
            {/* Level 2 inner glow effect using shadow */}
            {level.level >= 2 && !isSad && (
               <View style={[styles.innerGlow, { width: size, height: size, borderRadius: size/2 }]} />
            )}

            {/* Level 4+ golden rim */}
            {level.level >= 4 && !isSad && (
              <View
                style={[
                  styles.goldenRim,
                  {
                    width: size + 6,
                    height: size + 6,
                    borderRadius: (size + 6) / 2,
                    opacity: 0.8,
                  },
                ]}
              />
            )}

            {/* Level 5 halo */}
            {level.level >= 5 && !isSad && (
              <View
                style={[
                  styles.halo,
                  {
                    width: size * 0.6,
                    height: size * 0.12,
                    borderRadius: size * 0.06,
                    top: -size * 0.15,
                  },
                ]}
              >
                <View style={styles.haloInner} />
              </View>
            )}

            <CompanionFace expression={expression} size={size} />
          </View>

          {/* Level 3+ Particles container */}
          {particles && <View style={[styles.particlesOverlay, { width: size, height: size }]}>{particles}</View>}
        </Animated.View>

        {/* Level info */}
        {showLevel && (
          <View style={styles.levelInfo}>
            <MinimalText variant="caption" align="center" color={isSad ? colors.textSecondary : colors.accent} style={{ fontWeight: '700' }}>
              {level.name.toUpperCase()}
            </MinimalText>
            <MinimalText variant="caption" align="center" color={colors.textSecondary} style={{ fontSize: 10 }}>
              NÍVEL {level.level}
            </MinimalText>
            {/* XP progress bar */}
            <View style={styles.xpBarContainer}>
              <View style={[styles.xpBarFill, { width: `${Math.min(100, progress * 100)}%`, backgroundColor: isSad ? colors.textSecondary : colors.accent }]} />
            </View>
            <MinimalText variant="caption" align="center" color={colors.textSecondary} style={{ fontSize: 11, opacity: 0.7 }}>
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
    overflow: 'hidden',
  },
  innerGlow: {
    position: 'absolute',
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.5,
  },
  goldenRim: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#C9A84C',
    top: -3,
    left: -3,
  },
  halo: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#C9A84C',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
  },
  haloInner: {
    width: '80%',
    height: '40%',
    backgroundColor: '#C9A84C',
    borderRadius: 99,
    opacity: 0.3,
  },
  particlesOverlay: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
    shadowColor: '#FFF',
    shadowRadius: 4,
    shadowOpacity: 0.8,
    elevation: 4,
  },
  levelInfo: {
    marginTop: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  xpBarContainer: {
    width: 110,
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 2,
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
