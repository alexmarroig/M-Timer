import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingPage } from '../components/OnboardingPage';
import { MinimalText } from '../../../components/ui/MinimalText';
import { useUserStore } from '../../../store/userStore';
import { useSessionStore } from '../../../store/sessionStore';
import { colors, spacing, borderRadius } from '../../../core/theme';
import type { OnboardingStackParamList } from '../../../core/navigation/types';
import type { ExperienceLevel } from '../../../types/user';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Schedule'>;

const SCHEDULE_OPTIONS = [
  { id: 'morning_only', label: 'Só de manhã', morning: true, afternoon: false },
  { id: 'afternoon_only', label: 'Só à tarde', morning: false, afternoon: true },
  { id: 'both', label: 'Manhã e tarde', morning: true, afternoon: true },
  { id: 'flexible', label: 'Horário flexível', morning: false, afternoon: false },
] as const;

const EXPERIENCE_PRESET_PHASES: Record<ExperienceLevel, { rampUp: number; core: number; cooldown: number }> = {
  beginner: { rampUp: 180, core: 900, cooldown: 180 },
  regular: { rampUp: 120, core: 1200, cooldown: 180 },
  experienced: { rampUp: 60, core: 1500, cooldown: 120 },
};

const REMINDER_SUGGESTIONS: Record<ExperienceLevel, { morningHour: number; afternoonHour: number }> = {
  beginner: { morningHour: 8, afternoonHour: 18 },
  regular: { morningHour: 7, afternoonHour: 17 },
  experienced: { morningHour: 6, afternoonHour: 16 },
};

export function ScheduleScreen({ route }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const setMorningReminder = useUserStore((s) => s.setMorningReminder);
  const setAfternoonReminder = useUserStore((s) => s.setAfternoonReminder);
  const setExperienceLevel = useUserStore((s) => s.setExperienceLevel);
  const setDefaultTemplateId = useUserStore((s) => s.setDefaultTemplateId);

  const updateTemplate = useSessionStore((s) => s.updateTemplate);
  const setDefault = useSessionStore((s) => s.setDefault);

  const experience: ExperienceLevel = route.params?.experience || 'regular';

  const handleFinish = () => {
    setExperienceLevel(experience);

    const preset = EXPERIENCE_PRESET_PHASES[experience];
    updateTemplate('preset-morning', { phases: preset });
    setDefault('preset-morning');
    setDefaultTemplateId('preset-morning');

    // Set reminders based on schedule choice and suggested experience times
    const option = SCHEDULE_OPTIONS.find((o) => o.id === selected);
    const suggestions = REMINDER_SUGGESTIONS[experience];

    if (option?.morning) {
      setMorningReminder({ enabled: true, hour: suggestions.morningHour, minute: 0 });
    }

    if (option?.afternoon) {
      setAfternoonReminder({ enabled: true, hour: suggestions.afternoonHour, minute: 0 });
    }

    completeOnboarding();
  };

  const handleSkip = () => {
    setExperienceLevel(experience);
    completeOnboarding();
  };

  return (
    <OnboardingPage
      title="Sua rotina"
      description="Quando você costuma meditar? Configuraremos lembretes para você."
      buttonTitle="Começar a meditar"
      onNext={handleFinish}
      secondaryButtonTitle="Pular"
      onSecondary={handleSkip}
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
