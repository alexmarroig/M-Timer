import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { SettingRow } from '../components/SettingRow';
import { useUserStore } from '../../../store/userStore';
import { colors, spacing } from '../../../core/theme';
import { EXPERIENCE_LABELS, ExperienceLevel } from '../../../types/user';
import { notificationService } from '../../../services/notifications/notificationService';
import type { SettingsStackParamList } from '../../../core/navigation/types';

type TransitionSoundLabel = Record<string, string>;
const SOUND_LABELS: TransitionSoundLabel = {
  bell: 'Sino',
  vibration: 'Vibração',
  none: 'Nenhum',
};

const SOUND_OPTIONS = ['bell', 'vibration', 'none'] as const;
const EXPERIENCE_OPTIONS: ExperienceLevel[] = ['beginner', 'regular', 'experienced'];
const MORNING_REMINDER_ID = 'reminder-morning';
const AFTERNOON_REMINDER_ID = 'reminder-afternoon';

type Props = NativeStackScreenProps<SettingsStackParamList, 'SettingsMain'>;

export function SettingsScreen({ navigation }: Props) {
  const {
    transitionSound,
    showTimer,
    experienceLevel,
    morningReminder,
    afternoonReminder,
    setTransitionSound,
    setShowTimer,
    setExperienceLevel,
    setMorningReminder,
    setAfternoonReminder,
  } = useUserStore();

  const cycleSound = useCallback(() => {
    const currentIndex = SOUND_OPTIONS.indexOf(transitionSound);
    const nextIndex = (currentIndex + 1) % SOUND_OPTIONS.length;
    setTransitionSound(SOUND_OPTIONS[nextIndex]);
  }, [transitionSound, setTransitionSound]);

  const cycleExperience = useCallback(() => {
    const currentIndex = EXPERIENCE_OPTIONS.indexOf(experienceLevel);
    const nextIndex = (currentIndex + 1) % EXPERIENCE_OPTIONS.length;
    setExperienceLevel(EXPERIENCE_OPTIONS[nextIndex]);
  }, [experienceLevel, setExperienceLevel]);

  const toggleMorningReminder = useCallback(
    (enabled: boolean) => {
      const nextConfig = { ...morningReminder, enabled };
      setMorningReminder(nextConfig);

      if (nextConfig.enabled) {
        void notificationService.scheduleReminder(
          MORNING_REMINDER_ID,
          nextConfig,
          'Hora da meditação da manhã',
          'Reserve alguns minutos para sua prática.'
        );
        return;
      }

      void notificationService.cancelReminder(MORNING_REMINDER_ID);
    },
    [morningReminder, setMorningReminder]
  );

  const toggleAfternoonReminder = useCallback(
    (enabled: boolean) => {
      const nextConfig = { ...afternoonReminder, enabled };
      setAfternoonReminder(nextConfig);

      if (nextConfig.enabled) {
        void notificationService.scheduleReminder(
          AFTERNOON_REMINDER_ID,
          nextConfig,
          'Hora da meditação da tarde',
          'Que tal uma pausa para meditar agora?'
        );
        return;
      }

      void notificationService.cancelReminder(AFTERNOON_REMINDER_ID);
    },
    [afternoonReminder, setAfternoonReminder]
  );

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <MinimalText variant="heading" style={styles.title}>
          Configurações
        </MinimalText>

        {/* Timer */}
        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Sessão
        </MinimalText>

        <SettingRow
          type="toggle"
          label="Mostrar tempo"
          description="Exibe contagem regressiva durante a sessão"
          value={showTimer}
          onValueChange={setShowTimer}
        />

        <SettingRow
          type="select"
          label="Som de transição"
          description="Som entre fases da sessão"
          value={SOUND_LABELS[transitionSound]}
          onPress={cycleSound}
        />

        <SettingRow
          type="select"
          label="Nível de experiência"
          description="Personaliza recomendações e contexto da Home"
          value={EXPERIENCE_LABELS[experienceLevel]}
          onPress={cycleExperience}
        />

        {/* Reminders */}
        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Lembretes
        </MinimalText>

        <SettingRow
          type="toggle"
          label={`Manhã (${String(morningReminder.hour).padStart(2, '0')}:${String(morningReminder.minute).padStart(2, '0')})`}
          value={morningReminder.enabled}
          onValueChange={toggleMorningReminder}
        />

        <SettingRow
          type="toggle"
          label={`Tarde (${String(afternoonReminder.hour).padStart(2, '0')}:${String(afternoonReminder.minute).padStart(2, '0')})`}
          value={afternoonReminder.enabled}
          onValueChange={toggleAfternoonReminder}
        />

        {/* About */}
        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Sobre
        </MinimalText>

        <SettingRow
          type="navigate"
          label="Sobre a Meditação Transcendental"
          onPress={() => navigation.navigate('About')}
        />

        <SettingRow
          type="navigate"
          label="Encontrar um centro TM"
          onPress={() => Linking.openURL('https://www.tm.org')}
        />

        <View style={styles.footer}>
          <MinimalText variant="caption" color={colors.textSecondary} align="center">
            M-Timer v1.0.0
          </MinimalText>
          <MinimalText variant="caption" color={colors.textSecondary} align="center">
            Este app não ensina a técnica de MT.
          </MinimalText>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  footer: {
    marginTop: spacing.xxl,
    gap: spacing.xs,
    paddingBottom: spacing.xl,
  },
});
