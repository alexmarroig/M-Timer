import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingPage } from '../components/OnboardingPage';
import { MinimalText } from '../../../components/ui/MinimalText';
import { useUserStore } from '../../../store/userStore';
import { useSessionStore } from '../../../store/sessionStore';
import { colors, spacing, borderRadius } from '../../../core/theme';
import { notificationService } from '../../../services/notifications/notificationService';
import type { OnboardingStackParamList } from '../../../core/navigation/types';
import type { ExperienceLevel } from '../../../types/user';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Schedule'>;

const SCHEDULE_OPTIONS = [
  { id: 'morning_only', label: 'So de manha', morning: true, afternoon: false },
  { id: 'afternoon_only', label: 'So a tarde', morning: false, afternoon: true },
  { id: 'both', label: 'Manha e tarde', morning: true, afternoon: true },
  { id: 'flexible', label: 'Horario flexivel', morning: false, afternoon: false },
] as const;

const EXPERIENCE_PRESET_PHASES: Record<
  ExperienceLevel,
  { rampUp: number; core: number; cooldown: number }
> = {
  beginner: { rampUp: 180, core: 900, cooldown: 180 },
  regular: { rampUp: 120, core: 1200, cooldown: 180 },
  experienced: { rampUp: 60, core: 1500, cooldown: 120 },
};

const REMINDER_SUGGESTIONS: Record<
  ExperienceLevel,
  { morningHour: number; afternoonHour: number }
> = {
  beginner: { morningHour: 8, afternoonHour: 18 },
  regular: { morningHour: 7, afternoonHour: 17 },
  experienced: { morningHour: 6, afternoonHour: 16 },
};

const MORNING_REMINDER_ID = 'reminder-morning';
const AFTERNOON_REMINDER_ID = 'reminder-afternoon';

export function ScheduleScreen({ route }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const setMorningReminder = useUserStore((state) => state.setMorningReminder);
  const setAfternoonReminder = useUserStore((state) => state.setAfternoonReminder);
  const setExperienceLevel = useUserStore((state) => state.setExperienceLevel);
  const setDefaultTemplateId = useUserStore((state) => state.setDefaultTemplateId);

  const updateTemplate = useSessionStore((state) => state.updateTemplate);
  const setDefault = useSessionStore((state) => state.setDefault);

  const experience: ExperienceLevel = route.params?.experience || 'regular';

  const applyExperienceSetup = () => {
    setExperienceLevel(experience);

    const preset = EXPERIENCE_PRESET_PHASES[experience];
    updateTemplate('preset-morning', { phases: preset });
    setDefault('preset-morning');
    setDefaultTemplateId('preset-morning');
  };

  const handleFinish = () => {
    applyExperienceSetup();

    const option = SCHEDULE_OPTIONS.find((item) => item.id === selected);
    const suggestions = REMINDER_SUGGESTIONS[experience];

    if (option) {
      const morningConfig = { enabled: option.morning, hour: suggestions.morningHour, minute: 0 };
      const afternoonConfig = {
        enabled: option.afternoon,
        hour: suggestions.afternoonHour,
        minute: 0,
      };

      setMorningReminder(morningConfig);
      setAfternoonReminder(afternoonConfig);

      if (option.morning) {
        void notificationService.scheduleReminder(
          MORNING_REMINDER_ID,
          morningConfig,
          'Hora da meditacao da manha',
          'Reserve alguns minutos para sua pratica.'
        );
      } else {
        void notificationService.cancelReminder(MORNING_REMINDER_ID);
      }

      if (option.afternoon) {
        void notificationService.scheduleReminder(
          AFTERNOON_REMINDER_ID,
          afternoonConfig,
          'Hora da meditacao da tarde',
          'Que tal uma pausa para meditar agora?'
        );
      } else {
        void notificationService.cancelReminder(AFTERNOON_REMINDER_ID);
      }
    }

    completeOnboarding();
  };

  const handleSkip = () => {
    applyExperienceSetup();
    completeOnboarding();
  };

  return (
    <OnboardingPage
      title="Sua rotina"
      description="Quando voce costuma meditar? Configuraremos lembretes para voce."
      buttonTitle="Comecar a meditar"
      onNext={handleFinish}
      secondaryButtonTitle="Pular"
      onSecondary={handleSkip}
    >
      <View style={styles.options}>
        {SCHEDULE_OPTIONS.map((option) => (
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
  optionLabel: {
    fontWeight: '600',
  },
});
