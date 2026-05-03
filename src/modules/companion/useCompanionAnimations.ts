import { useRef, useEffect, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { CompanionMood, SessionExpression } from '../../types/companion';

export function useCompanionAnimations(
  mood: CompanionMood,
  sessionExpression: SessionExpression
) {
  const floatY   = useRef(new Animated.Value(0)).current;
  const scale    = useRef(new Animated.Value(1)).current;
  const scaleX   = useRef(new Animated.Value(1)).current; // for squash & stretch
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const bounceY  = useRef(new Animated.Value(0)).current;

  const floatRef  = useRef<Animated.CompositeAnimation | null>(null);
  const breathRef = useRef<Animated.CompositeAnimation | null>(null);
  const glowRef   = useRef<Animated.CompositeAnimation | null>(null);
  const wobbleRef = useRef<Animated.CompositeAnimation | null>(null);

  const stopAll = useCallback(() => {
    floatRef.current?.stop();
    breathRef.current?.stop();
    glowRef.current?.stop();
    wobbleRef.current?.stop();
  }, []);

  // ── Float (up/down) ────────────────────────────────────────────────────────
  const startFloat = useCallback((amplitude: number, duration: number) => {
    floatRef.current?.stop();
    floatRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -amplitude,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: amplitude,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    floatRef.current.start();
  }, [floatY]);

  // ── Breathe (scale Y + inverse scaleX for squash-and-stretch feel) ─────────
  const startBreathe = useCallback((min: number, max: number, duration: number) => {
    breathRef.current?.stop();

    // Squash & stretch: when Y scale grows, X slightly shrinks and vice versa
    const xMin = 1 + (max - 1) * 0.4;  // subtle counter-squeeze
    const xMax = 1 - (1 - min) * 0.4;

    breathRef.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: max,
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleX, {
            toValue: xMax,
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: min,
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleX, {
            toValue: xMin,
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    breathRef.current.start();
  }, [scale, scaleX]);

  // ── Glow ────────────────────────────────────────────────────────────────────
  const startGlow = useCallback((min: number, max: number, duration: number) => {
    glowRef.current?.stop();
    glowRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: max,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: min,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    glowRef.current.start();
  }, [glowOpacity]);

  // ── Wobble (side-to-side rotation, for happy/ecstatic) ──────────────────────
  const startWobble = useCallback((amplitude: number, duration: number) => {
    wobbleRef.current?.stop();
    wobbleRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: -amplitude,
          duration: duration / 4,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: amplitude,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: duration / 4,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    wobbleRef.current.start();
  }, [rotation]);

  // ── Tilt (static lean, for paused) ─────────────────────────────────────────
  const startTilt = useCallback(() => {
    Animated.timing(rotation, {
      toValue: 0.5,
      duration: 400,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start();
  }, [rotation]);

  const resetTilt = useCallback(() => {
    Animated.timing(rotation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [rotation]);

  // ── Bounce + squash on tap ───────────────────────────────────────────────────
  const triggerBounce = useCallback(() => {
    Animated.sequence([
      // Squash down slightly before launch
      Animated.parallel([
        Animated.timing(bounceY, { toValue: 6, duration: 80, useNativeDriver: true }),
        Animated.timing(scaleX, { toValue: 1.15, duration: 80, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      ]),
      // Launch up with stretch
      Animated.parallel([
        Animated.timing(bounceY, { toValue: -28, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scaleX, { toValue: 0.9, duration: 180, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.1, duration: 180, useNativeDriver: true }),
      ]),
      // Spring back
      Animated.parallel([
        Animated.spring(bounceY, { toValue: 0, friction: 4, tension: 120, useNativeDriver: true }),
        Animated.spring(scaleX, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
      ]),
    ]).start();
  }, [bounceY, scaleX, scale]);

  // ── Main effect: react to state/mood changes ───────────────────────────────
  useEffect(() => {
    stopAll();
    resetTilt();
    scaleX.setValue(1);

    switch (sessionExpression) {
      case 'rampUp':
        // Getting settled — medium speed breathing, gentle float
        startFloat(5, 4000);
        startBreathe(0.96, 1.06, 4500);
        startGlow(0.25, 0.55, 3000);
        break;

      case 'core':
        // Deep meditation — SLOW but clearly visible breathing (6% swing each way)
        startFloat(3, 7000);
        startBreathe(0.94, 1.07, 6500);
        startGlow(0.3, 0.65, 5000);
        break;

      case 'cooldown':
        // Coming back — medium breathing, a bit more float
        startFloat(6, 3500);
        startBreathe(0.95, 1.07, 3800);
        startGlow(0.4, 0.8, 2800);
        break;

      case 'finished':
        // Celebration — big float, bright glow, quick pulse
        startFloat(10, 1800);
        startBreathe(0.94, 1.1, 1600);
        startGlow(0.6, 1.0, 1200);
        triggerBounce();
        break;

      case 'paused':
        startFloat(2, 5000);
        startTilt();
        startGlow(0.12, 0.3, 3500);
        break;

      case 'idle':
      default:
        switch (mood) {
          case 'sleepy':
            startFloat(3, 5500);
            startBreathe(0.98, 1.03, 5500);
            startGlow(0.08, 0.22, 4500);
            break;
          case 'sad':
            startFloat(2, 7000);
            startBreathe(0.99, 1.02, 7000);
            startGlow(0.05, 0.14, 5500);
            break;
          case 'neglected':
            startFloat(1, 9000);
            startGlow(0.02, 0.08, 7000);
            break;
          case 'content':
            startFloat(6, 3200);
            startBreathe(0.96, 1.06, 3800);
            startGlow(0.25, 0.55, 2800);
            break;
          case 'happy':
            // Gentle wobble + energetic float
            startFloat(8, 2800);
            startBreathe(0.95, 1.08, 3200);
            startGlow(0.35, 0.75, 2400);
            startWobble(0.6, 3000);
            break;
          case 'ecstatic':
            // Fast wobble, big breathing, bright glow
            startFloat(10, 2200);
            startBreathe(0.93, 1.1, 2800);
            startGlow(0.5, 1.0, 2000);
            startWobble(0.9, 2200);
            break;
        }
        break;
    }

    return () => stopAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, sessionExpression]);

  // Rotation interpolation supports both wobble and tilt ranges
  const rotateInterpolation = rotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  return {
    floatY,
    scale,
    scaleX,
    glowOpacity,
    rotation: rotateInterpolation,
    bounceY,
    triggerBounce,
  };
}
