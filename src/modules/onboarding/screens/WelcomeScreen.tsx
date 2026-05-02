import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { MinimalText } from '../../../components/ui/MinimalText';
import { CompanionCharacter } from '../../companion/CompanionCharacter';
import { colors, spacing } from '../../../core/theme';
import type { OnboardingStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      {/* Companion hero */}
      <Animated.View style={[styles.companionArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <CompanionCharacter
          sessionExpression="idle"
          size={140}
          showLevel={false}
        />
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <MinimalText variant="heading" align="center" color={colors.primary}>
          M-Timer 🧘
        </MinimalText>
        <MinimalText
          variant="body"
          align="center"
          color={colors.textSecondary}
          style={styles.description}
        >
          Seu companheiro de prática para Meditação Transcendental. Sessões estruturadas em 3 fases para uma experiência completa.
        </MinimalText>

        <View style={styles.featureRow}>
          {['🌅 3 fases', '🔔 Lembretes', '✨ Companion'].map((f) => (
            <View key={f} style={styles.featureChip}>
              <MinimalText variant="caption" color={colors.textSecondary} style={styles.featureText}>
                {f}
              </MinimalText>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.buttons, { opacity: fadeAnim }]}>
        <ButtonPrimary
          title="Começar"
          onPress={() => navigation.navigate('MantraInfo')}
          size="large"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl,
  },
  companionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  description: {
    marginTop: spacing.md,
    maxWidth: 300,
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  featureChip: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  featureText: {
    fontSize: 12,
  },
  buttons: {
    width: '100%',
  },
});
