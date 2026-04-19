import { useRef, useEffect, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { CompanionMood, SessionExpression } from '../../types/companion';

interface AnimationValues {
  floatY: Animated.Value;
  scale: Animated.Value;
  glowOpacity: Animated.Value;
  rotation: Animated.Value;
  bounceY: Animated.Value;
}

export function useCompanionAnimations(
  mood: CompanionMood,
  sessionExpression: SessionExpression
) {
  const floatY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const bounceY = useRef(new Animated.Value(0)).current;

  const floatRef = useRef<Animated.CompositeAnimation | null>(null);
  const breatheRef = useRef<Animated.CompositeAnimation | null>(null);
  const glowRef = useRef<Animated.CompositeAnimation | null>(null);

  const stopAll = useCallback(() => {
    floatRef.current?.stop();
    breatheRef.current?.stop();
    glowRef.current?.stop();
  }, []);

  // Float animation (gentle up/down)
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

  // Breathe animation (scale pulse)
  const startBreathe = useCallback((min: number, max: number, duration: number) => {
    breatheRef.current?.stop();
    breatheRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: max,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: min,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    breatheRef.current.start();
  }, [scale]);

  // Glow animation
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

  // Celebration bounce
  const triggerBounce = useCallback(() => {
    Animated.sequence([
      Animated.timing(bounceY, {
        toValue: -25,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(bounceY, {
        toValue: 0,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bounceY]);

  // Tilt for paused state
  const startTilt = useCallback(() => {
    Animated.timing(rotation, {
      toValue: 1,
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

  // React to session state changes
  useEffect(() => {
    stopAll();
    resetTilt();

    switch (sessionExpression) {
      case 'rampUp':
        startFloat(4, 4500);
        startBreathe(0.98, 1.03, 5500);
        startGlow(0.2, 0.45, 3500);
        break;
      case 'core':
        startFloat(2, 8000); // Extremely slow and subtle
        startBreathe(0.99, 1.01, 8000);
        startGlow(0.25, 0.5, 5000);
        break;
      case 'cooldown':
        startFloat(5, 4000);
        startBreathe(0.97, 1.05, 4000);
        startGlow(0.35, 0.75, 3000);
        break;
      case 'finished':
        startFloat(8, 2000);
        startGlow(0.6, 1.0, 1500);
        triggerBounce();
        break;
      case 'paused':
        startFloat(2, 5000);
        startTilt();
        startGlow(0.15, 0.3, 3000);
        break;
      case 'idle':
      default:
        // Use mood-based animations
        switch (mood) {
          case 'sleepy':
            startFloat(3, 5000);
            startBreathe(0.98, 1.02, 5000);
            startGlow(0.1, 0.25, 4000);
            break;
          case 'sad':
            startFloat(2, 6000);
            startBreathe(0.99, 1.01, 7000);
            startGlow(0.05, 0.15, 5000);
            break;
          case 'neglected':
            startFloat(1, 8000);
            startBreathe(1, 1, 8000);
            startGlow(0.02, 0.1, 6000);
            break;
          case 'content':
            startFloat(5, 3500);
            startBreathe(0.97, 1.04, 4000);
            startGlow(0.2, 0.5, 3000);
            break;
          case 'happy':
            startFloat(6, 3000);
            startBreathe(0.97, 1.05, 3500);
            startGlow(0.3, 0.7, 2500);
            break;
          case 'ecstatic':
            startFloat(8, 2500);
            startBreathe(0.96, 1.06, 3000);
            startGlow(0.5, 0.9, 2000);
            break;
        }
        break;
    }

    return () => stopAll();
  }, [mood, sessionExpression]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '8deg'],
  });

  return {
    floatY,
    scale,
    glowOpacity,
    rotation: rotateInterpolation,
    bounceY,
    triggerBounce,
  };
}
