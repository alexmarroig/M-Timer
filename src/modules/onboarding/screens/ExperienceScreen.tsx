import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingPage } from '../components/OnboardingPage';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing, borderRadius } from '../../../core/theme';
import type { OnboardingStackParamList } from '../../../core/navigation/types';
import type { ExperienceLevel } from '../../../types/user';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Experience'>;

const OPTIONS: Array<{ id: ExperienceLevel; label: string; desc: string }> = [
  { id: 'beginner', label: 'Iniciante', desc: 'Aprendi recentemente' },
  { id: 'regular', label: 'Regular', desc: 'Pratico há alguns meses' },
  { id: 'experienced', label: 'Experiente', desc: 'Pratico há mais de 1 ano' },
];

export function ExperienceScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<ExperienceLevel | null>(null);

  return (
    <OnboardingPage
      title="Sua experiência"
      description="Há quanto tempo você pratica Meditação Transcendental?"
      buttonTitle="Continuar"
      onNext={() => navigation.navigate('Schedule', { experience: selected || 'regular' })}
    >
      <View style={styles.options}>
        {OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.option, selected === option.id && styles.optionSelected]}
            onPress={() => setSelected(option.id)}
            activeOpacity={0.7}
          >
            <MinimalText
              variant="body"
              color={selected === option.id ? colors.textInverse : colors.textPrimary}
              style={styles.optionLabel}
            >
              {option.label}
            </MinimalText>
            <MinimalText
              variant="caption"
              color={selected === option.id ? colors.accentLight : colors.textSecondary}
            >
              {option.desc}
            </MinimalText>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingPage>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.sm,
  },
  option: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionLabel: {
    fontWeight: '600',
  },
});
