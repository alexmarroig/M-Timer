import React, { useCallback } from 'react';
import { Alert, ScrollView, View, StyleSheet, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { SettingRow } from '../components/SettingRow';
import { useAuthStore } from '../../../store/authStore';
import { useUserStore } from '../../../store/userStore';
import { colors, spacing } from '../../../core/theme';
import { notificationService } from '../../../services/notifications/notificationService';
import type { SettingsStackParamList } from '../../../core/navigation/types';
import type { AmbientTrack, ExperienceLevel } from '../../../types/user';
import { EXPERIENCE_LABELS } from '../../../types/user';

type TransitionSoundLabel = Record<string, string>;
const SOUND_LABELS: TransitionSoundLabel = {
  bell: 'Sino',
  vibration: 'Vibracao',
  none: 'Nenhum',
};

const SOUND_OPTIONS = ['bell', 'vibration', 'none'] as const;
const AMBIENT_LABELS: Record<AmbientTrack, string> = {
  ambient: 'Pad ambiente',
  rain: 'Chuva suave',
  wind: 'Vento leve',
};
const AMBIENT_OPTIONS: AmbientTrack[] = ['ambient', 'rain', 'wind'];
const EXPERIENCE_OPTIONS: ExperienceLevel[] = ['beginner', 'regular', 'experienced'];
const MORNING_REMINDER_ID = 'reminder-morning';
const AFTERNOON_REMINDER_ID = 'reminder-afternoon';

type Props = NativeStackScreenProps<SettingsStackParamList, 'SettingsMain'>;

export function SettingsScreen({ navigation }: Props) {
  const userEmail = useAuthStore((state) => state.userEmail);
  const logout = useAuthStore((state) => state.logout);
  const {
    transitionSound,
    showTimer,
    experienceLevel,
    ambientEnabled,
    ambientTrack,
    morningReminder,
    afternoonReminder,
    setTransitionSound,
    setShowTimer,
    setExperienceLevel,
    setAmbientEnabled,
    setAmbientTrack,
    setMorningReminder,
    setAfternoonReminder,
  } = useUserStore();

  const cycleSound = useCallback(() => {
    const currentIndex = SOUND_OPTIONS.indexOf(transitionSound);
    const nextIndex = (currentIndex + 1) % SOUND_OPTIONS.length;
    setTransitionSound(SOUND_OPTIONS[nextIndex]);
  }, [setTransitionSound, transitionSound]);

  const cycleExperience = useCallback(() => {
    const currentIndex = EXPERIENCE_OPTIONS.indexOf(experienceLevel);
    const nextIndex = (currentIndex + 1) % EXPERIENCE_OPTIONS.length;
    setExperienceLevel(EXPERIENCE_OPTIONS[nextIndex]);
  }, [experienceLevel, setExperienceLevel]);

  const cycleAmbientTrack = useCallback(() => {
    const currentIndex = AMBIENT_OPTIONS.indexOf(ambientTrack);
    const nextIndex = (currentIndex + 1) % AMBIENT_OPTIONS.length;
    setAmbientTrack(AMBIENT_OPTIONS[nextIndex]);
  }, [ambientTrack, setAmbientTrack]);

  const toggleMorningReminder = useCallback(
    (enabled: boolean) => {
      const nextConfig = { ...morningReminder, enabled };
      setMorningReminder(nextConfig);

      if (nextConfig.enabled) {
        void notificationService.scheduleReminder(
          MORNING_REMINDER_ID,
          nextConfig,
          'Hora da meditacao da manha',
          'Reserve alguns minutos para sua pratica.'
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
          'Hora da meditacao da tarde',
          'Que tal uma pausa para meditar agora?'
        );
        return;
      }

      void notificationService.cancelReminder(AFTERNOON_REMINDER_ID);
    },
    [afternoonReminder, setAfternoonReminder]
  );

  const handleLogout = useCallback(() => {
    Alert.alert('Sair da conta', 'Deseja encerrar a sessao demo neste dispositivo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }, [logout]);

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <MinimalText variant="heading" style={styles.title}>
          Configuracoes
        </MinimalText>

        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Sessao
        </MinimalText>

        <SettingRow
          type="toggle"
          label="Mostrar tempo"
          description="Exibe contagem regressiva durante a sessao"
          value={showTimer}
          onValueChange={setShowTimer}
        />

        <SettingRow
          type="select"
          label="Som de transicao"
          description="Som curto entre fases da sessao"
          value={SOUND_LABELS[transitionSound]}
          onPress={cycleSound}
        />

        <SettingRow
          type="select"
          label="Nivel de experiencia"
          description="Personaliza recomendacoes e contexto da Home"
          value={EXPERIENCE_LABELS[experienceLevel]}
          onPress={cycleExperience}
        />

        <SettingRow
          type="toggle"
          label="Som ambiente"
          description="Trilha continua durante a meditacao"
          value={ambientEnabled}
          onValueChange={setAmbientEnabled}
        />

        <SettingRow
          type="select"
          label="Trilha ambiente"
          description="Escolha a textura sonora da pratica"
          value={AMBIENT_LABELS[ambientTrack]}
          onPress={cycleAmbientTrack}
        />

        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Lembretes
        </MinimalText>

        <SettingRow
          type="toggle"
          label={`Manha (${String(morningReminder.hour).padStart(2, '0')}:${String(morningReminder.minute).padStart(2, '0')})`}
          value={morningReminder.enabled}
          onValueChange={toggleMorningReminder}
        />

        <SettingRow
          type="toggle"
          label={`Tarde (${String(afternoonReminder.hour).padStart(2, '0')}:${String(afternoonReminder.minute).padStart(2, '0')})`}
          value={afternoonReminder.enabled}
          onValueChange={toggleAfternoonReminder}
        />

        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Sobre
        </MinimalText>

        <SettingRow
          type="navigate"
          label="Sobre a Meditacao Transcendental"
          onPress={() => navigation.navigate('About')}
        />

        <SettingRow
          type="navigate"
          label="Encontrar um centro TM"
          onPress={() => Linking.openURL('https://www.tm.org')}
        />

        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Conta
        </MinimalText>

        <SettingRow
          type="navigate"
          label="Conta demo ativa"
          description={userEmail || 'demo@mtimer.app'}
          onPress={() => {}}
        />

        <SettingRow
          type="navigate"
          label="Sair da conta"
          description="Volta para a tela de login demo"
          onPress={handleLogout}
        />

        <View style={styles.footer}>
          <MinimalText variant="caption" color={colors.textSecondary} align="center">
            M-Timer v1.0.0
          </MinimalText>
          <MinimalText variant="caption" color={colors.textSecondary} align="center">
            Este app nao ensina a tecnica de MT.
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
