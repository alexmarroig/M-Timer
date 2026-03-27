import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingPage } from '../components/OnboardingPage';
import { MinimalText } from '../../../components/ui/MinimalText';
import { useUserStore } from '../../../store/userStore';
import { useSessionStore } from '../../../store/sessionStore';
import { colors, spacing, borderRadius } from '../../../core/theme';
import type { OnboardingStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Schedule'>;

const SCHEDULE_OPTIONS = [
  { id: 'morning_only', label: 'Só de manhã', morning: true, afternoon: false },
  { id: 'afternoon_only', label: 'Só à tarde', morning: false, afternoon: true },
  { id: 'both', label: 'Manhã e tarde', morning: true, afternoon: true },
  { id: 'flexible', label: 'Horário flexível', morning: false, afternoon: false },
];

export function ScheduleScreen({ route }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const setMorningReminder = useUserStore((s) => s.setMorningReminder);
  const setAfternoonReminder = useUserStore((s) => s.setAfternoonReminder);

  const experience = route.params?.experience || 'regular';

  const handleFinish = () => {
    // Set reminders based on schedule choice
    const option = SCHEDULE_OPTIONS.find((o) => o.id === selected);
    if (option) {
      if (option.morning) {
        setMorningReminder({ enabled: true, hour: 7, minute: 0 });
      }
      if (option.afternoon) {
        setAfternoonReminder({ enabled: true, hour: 17, minute: 0 });
      }
    }

    completeOnboarding();
  };

  return (
    <OnboardingPage
      title="Sua rotina"
      description="Quando você costuma meditar? Configuraremos lembretes para você."
      buttonTitle="Começar a meditar"
      onNext={handleFinish}
      secondaryButtonTitle="Pular"
      onSecondary={completeOnboarding}
    >
      <View style={styles.options}>
        {SCHEDULE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.option, selected === opt.id && styles.optionSelected]}
            onPress={() => setSelected(opt.id)}
            activeOpacity={0.7}
          >
            <MinimalText
              variant="body"
              color={selected === opt.id ? colors.textInverse : colors.textPrimary}
              style={{ fontWeight: '600' }}
            >
              {opt.label}
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
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
