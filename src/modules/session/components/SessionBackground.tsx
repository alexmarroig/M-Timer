import React, { useEffect, useRef, useCallback } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { TimerState } from '../../../types/session';

const { width: W, height: H } = Dimensions.get('window');

// ─── Phase palette ───────────────────────────────────────────────────────────
// Each phase has a gradient pair + accent color for particles/circle
const PHASE_PALETTE: Record<string, { top: string; bottom: string; circle: string; particle: string }> = {
  idle:     { top: '#FAFAFA',  bottom: '#F5F5F5',  circle: '#E0E0E0', particle: '#CCCCCC' },
  rampUp:   { top: '#FFFBF0',  bottom: '#FFF3D4',  circle: '#FFD98B', particle: '#FFBD59' },
  core:     { top: '#F0F5FF',  bottom: '#E4EEFF',  circle: '#A8C0FF', particle: '#7B9FFF' },
  cooldown: { top: '#F0FDF6',  bottom: '#E4F8EE',  circle: '#8EDDB0', particle: '#5CC98A' },
  paused:   { top: '#F8F8F8',  bottom: '#F0F0F0',  circle: '#D0D0D0', particle: '#B0B0B0' },
  finished: { top: '#FFFDF0',  bottom: '#FFF8D4',  circle: '#FFE566', particle: '#FFD700' },
};

// Breathing cycle duration per phase (ms per half-cycle)
const BREATH_DURATION: Record<string, number> = {
  idle:     3000,
  rampUp:   2500,  // faster — entering, getting settled
  core:     5000,  // slow, deep
  cooldown: 3500,  // returning
  paused:   4000,
  finished: 1500,  // celebratory pulse
};

const NUM_PARTICLES = 8;
const PARTICLE_SIZES = [5, 7, 4, 8, 5, 6, 4, 7];
const PARTICLE_X = [0.12, 0.28, 0.45, 0.60, 0.75, 0.88, 0.33, 0.66];
const PARTICLE_DELAYS = [0, 800, 1600, 400, 1200, 2000, 2400, 600];
const PARTICLE_DURATION = [4000, 5000, 4500, 5500, 4200, 4800, 5200, 4600];

interface Props {
  state: TimerState;
}

export function SessionBackground({ state }: Props) {
  const palette = PHASE_PALETTE[state] ?? PHASE_PALETTE.idle;
  const breathDuration = BREATH_DURATION[state] ?? 3000;

  // ── Gradient fade between phases ──────────────────────────────────────────
  const gradientOpacity = useRef(new Animated.Value(1)).current;
  const prevState = useRef(state);

  const fadeTransition = useCallback(() => {
    gradientOpacity.setValue(0);
    Animated.timing(gradientOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [gradientOpacity]);

  useEffect(() => {
    if (state !== prevState.current) {
      prevState.current = state;
      fadeTransition();
    }
  }, [state, fadeTransition]);

  // ── Breathing circle ───────────────────────────────────────────────────────
  const breathScale = useRef(new Animated.Value(0.88)).current;
  const breathOpacity = useRef(new Animated.Value(0.18)).current;
  const breathAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    breathAnimRef.current?.stop();

    const scaleIn = Animated.timing(breathScale, {
      toValue: 1.12,
      duration: breathDuration,
      useNativeDriver: true,
    });
    const scaleOut = Animated.timing(breathScale, {
      toValue: 0.88,
      duration: breathDuration,
      useNativeDriver: true,
    });
    const opacityIn = Animated.timing(breathOpacity, {
      toValue: state === 'finished' ? 0.35 : 0.22,
      duration: breathDuration,
      useNativeDriver: true,
    });
    const opacityOut = Animated.timing(breathOpacity, {
      toValue: 0.10,
      duration: breathDuration,
      useNativeDriver: true,
    });

    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([scaleIn, scaleOut]),
        Animated.sequence([opacityIn, opacityOut]),
      ])
    );

    breathAnimRef.current = loop;
    loop.start();

    return () => {
      breathAnimRef.current?.stop();
    };
  }, [state, breathDuration, breathScale, breathOpacity]);

  // ── Particles ─────────────────────────────────────────────────────────────
  const particleAnims = useRef(
    Array.from({ length: NUM_PARTICLES }, () => ({
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const loops: Animated.CompositeAnimation[] = [];

    particleAnims.forEach((anim, i) => {
      const duration = PARTICLE_DURATION[i];
      const delay = PARTICLE_DELAYS[i];

      // Reset
      anim.y.setValue(0);
      anim.opacity.setValue(0);

      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim.y, {
              toValue: -H * 0.55,
              duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(anim.opacity, {
                toValue: state === 'paused' || state === 'idle' ? 0.25 : 0.55,
                duration: duration * 0.2,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: duration * 0.8,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ])
      );

      loops.push(loop);
      loop.start();
    });

    return () => loops.forEach((l) => l.stop());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const circleSize = W * 1.1;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Gradient background */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradientOpacity }]}>
        <LinearGradient
          colors={[palette.top, palette.bottom]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Breathing circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: palette.circle,
            opacity: breathOpacity,
            transform: [{ scale: breathScale }],
            left: W / 2 - circleSize / 2,
            top: H * 0.25 - circleSize / 2,
          },
        ]}
      />

      {/* Floating particles */}
      {particleAnims.map((anim, i) => {
        const size = PARTICLE_SIZES[i];
        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: palette.particle,
                left: W * PARTICLE_X[i],
                bottom: H * 0.15,
                opacity: anim.opacity,
                transform: [{ translateY: anim.y }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
  },
  particle: {
    position: 'absolute',
    shadowColor: '#FFF',
    shadowRadius: 6,
    shadowOpacity: 0.6,
    elevation: 2,
  },
});
