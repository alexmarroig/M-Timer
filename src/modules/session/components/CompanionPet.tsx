import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { MinimalText } from '../../../components/ui/MinimalText';
import { borderRadius, colors, spacing } from '../../../core/theme';
import type { CompanionMood } from '../../../core/utils/gamification';

interface Props {
  mood: CompanionMood;
  level: number;
  coins: number;
  xp: number;
  lastRewardXp: number;
  lastRewardCoins: number;
}

export function CompanionPet({ mood, level, coins, xp, lastRewardXp, lastRewardCoins }: Props) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const moodScale = useMemo(() => (mood === 'excited' ? 1.06 : mood === 'happy' ? 1.03 : 1), [mood]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: mood === 'excited' ? 550 : 950,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: mood === 'excited' ? 450 : 850,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [floatAnim, mood]);

  const status =
    mood === 'excited'
      ? 'Animado! ✨'
      : mood === 'happy'
      ? 'Feliz 😊'
      : mood === 'calm'
      ? 'Tranquilo 🌿'
      : 'Com soninho 😴';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MinimalText variant="subheading">Companheiro</MinimalText>
        <MinimalText variant="caption" color={colors.textSecondary}>
          {status}
        </MinimalText>
      </View>

      <Animated.View style={[styles.petWrap, { transform: [{ translateY: floatAnim }, { scale: moodScale }] }]}>
        <View style={styles.shadow} />
        <View style={styles.pet}>
          <View style={[styles.eye, styles.eyeLeft]} />
          <View style={[styles.eye, styles.eyeRight]} />
          <MinimalText style={styles.mouth}>◡</MinimalText>
          <View style={[styles.blush, styles.blushLeft]} />
          <View style={[styles.blush, styles.blushRight]} />
        </View>
      </Animated.View>

      <View style={styles.statsRow}>
        <MinimalText variant="caption">Lv {level}</MinimalText>
        <MinimalText variant="caption">XP {xp}</MinimalText>
        <MinimalText variant="caption">Moedas {coins}</MinimalText>
      </View>

      {(lastRewardXp > 0 || lastRewardCoins > 0) && (
        <MinimalText variant="caption" color={colors.primary} align="center" style={styles.rewardText}>
          Recompensa recente: +{lastRewardXp} XP · +{lastRewardCoins} moedas
        </MinimalText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  petWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  pet: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F4E0BE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2B2118',
    position: 'absolute',
    top: 52,
  },
  eyeLeft: {
    left: 40,
  },
  eyeRight: {
    right: 40,
  },
  mouth: {
    marginTop: 8,
    color: '#2B2118',
    fontSize: 26,
  },
  blush: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1B69E',
    opacity: 0.55,
    position: 'absolute',
    top: 64,
  },
  blushLeft: {
    left: 20,
  },
  blushRight: {
    right: 20,
  },
  shadow: {
    position: 'absolute',
    bottom: -6,
    width: 90,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E8CDA2',
    opacity: 0.45,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rewardText: {
    marginTop: spacing.xs,
  },
});

