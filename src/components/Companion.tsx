import React, { memo, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
  type ImageStyle,
  type ViewStyle,
} from 'react-native';
import { colors } from '../core/theme';
import type { SessionPhase } from '../types/session';
import type {
  CompanionPlacement,
  CompanionRenderMode,
  CompanionState,
} from '../services/companionEngine';
import type { EvolutionTier } from '../services/gamificationEngine';

const COMPANION_IMAGE = require('../../assets/companion/companion.png');

interface Props {
  placement: CompanionPlacement;
  phase: SessionPhase;
  evolutionTier: EvolutionTier;
  calmness: number;
  preferredMode?: CompanionRenderMode;
  state: CompanionState;
}

function CompanionComponent({
  placement,
  phase,
  evolutionTier: _evolutionTier,
  calmness,
  preferredMode = 'image',
  state,
}: Props) {
  const motion = useRef(new Animated.Value(0)).current;
  const visibility = useRef(new Animated.Value(state.baseOpacity)).current;

  const sparkle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    motion.stopAnimation();
    motion.setValue(0);

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, {
          toValue: 1,
          duration: Math.round(state.cycleDurationMs / 2),
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: Math.round(state.cycleDurationMs / 2),
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkle, {
          toValue: 1,
          duration: 950,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sparkle, {
          toValue: 0,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    sparkleLoop.start();

    return () => {
      loop.stop();
      sparkleLoop.stop();
    };
  }, [motion, sparkle, state.cycleDurationMs]);

  useEffect(() => {
    Animated.timing(visibility, {
      toValue: state.baseOpacity,
      duration: phase === 'cooldown' ? 1600 : 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [phase, state.baseOpacity, visibility]);

  const size = useMemo(() => {
    const baseSize = placement === 'player' ? 190 : 120;
    return Math.round(baseSize * (1 + state.sizeBoost));
  }, [placement, state.sizeBoost]);

  const scale = motion.interpolate({
    inputRange: [0, 1],
    outputRange: state.breathingRange,
  });

  const translateY = motion.interpolate({
    inputRange: [0, 1],
    outputRange: state.floatRange,
  });

  const glowOpacity = motion.interpolate({
    inputRange: [0, 1],
    outputRange: state.glowOpacityRange,
  });

  const shadowScale = motion.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const glowColor =
    phase === 'rampUp'
      ? colors.rampUp
      : phase === 'cooldown'
      ? colors.cooldown
      : '#F0D9A3';

  const sparkleOpacity = sparkle.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.15, 0.9, 0.15],
  });

  const mediaStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    opacity: Math.min(state.brightness, 1),
  } satisfies ImageStyle;

  const frameStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    shadowOpacity: 0.08 + calmness * 0.14 + Math.max(0, state.brightness - 1) * 0.4,
  } satisfies ViewStyle;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.12,
            height: size * 1.12,
            borderRadius: size,
            backgroundColor: glowColor,
            opacity: Animated.multiply(glowOpacity, visibility),
          },
        ]}
      />

      <Animated.View
        style={[
          styles.sparkleContainer,
          {
            opacity: sparkleOpacity,
            transform: [
              {
                scale: sparkle.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.9, 1.05, 0.9],
                }),
              },
            ],
          },
        ]}
      >
        {[...Array(6)].map((_, index) => {
          const angle = (Math.PI * 2 * index) / 6;
          const radius = size * 0.75;
          const left = radius + Math.cos(angle) * radius * 0.65;
          const top = radius + Math.sin(angle) * radius * 0.65;

          const starStyle = {
            left,
            top,
            transform: [
              {
                rotate: `${index * 60}deg`,
              },
            ],
          };

          return <View key={index} style={[styles.sparkle, starStyle]} />;
        })}
      </Animated.View>

      <Animated.View
        style={[
          styles.orbWrap,
          {
            opacity: visibility,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <View style={[styles.frame, frameStyle]}>
          <Image source={COMPANION_IMAGE} style={mediaStyle} resizeMode="cover" />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.groundShadow,
          {
            width: size * 0.72,
            opacity: 0.16 + calmness * 0.14,
            transform: [{ scaleX: shadowScale }],
          },
        ]}
      />

      <View style={styles.lightBurst}>
        <View style={styles.lightRing} />
      </View>
    </View>
  );
}

export const Companion = memo(CompanionComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  sparkleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 12,
  },
  orbWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    overflow: 'hidden',
    backgroundColor: '#F6EAD1',
    shadowColor: '#C9A84C',
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowRadius: 28,
    elevation: 8,
  },
  groundShadow: {
    marginTop: 14,
    height: 16,
    borderRadius: 999,
    backgroundColor: '#CDA96D',
  },
  lightBurst: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightRing: {
    width: '150%',
    height: '150%',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: '#F8EDC1',
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 14,
    transform: [{ scale: 1.02 }],
  },
});
