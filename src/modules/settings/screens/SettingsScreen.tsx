import React, { useCallback } from 'react';
import { Alert, ScrollView, View, StyleSheet, Linking, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { SettingRow } from '../components/SettingRow';
import { ThemeSelector } from '../../companion/ThemeSelector';
import { useAuthStore } from '../../../store/authStore';
import { useUserStore } from '../../../store/userStore';
import { colors, spacing } from '../../../core/theme';
import { notificationService } from '../../../services/notifications/notificationService';
import type { SettingsStackParamList } from '../../../core/navigation/types';
import type { AmbientTrack, ExperienceLevel, TransitionSound } from '../../../types/user';
import { EXPERIENCE_LABELS } from '../../../types/user';

const SOUND_LABELS: Record<TransitionSound, string> = {
  bell: 'Sino Tradicional',
  bowl: 'Tigela Tibetana',
  'soft-bell': 'Sino Suave',
  vibration: 'Vibração',
  none: 'Nenhum',
};

const SOUND_OPTIONS: TransitionSound[] = ['bell', 'bowl', 'soft-bell', 'vibration', 'none'];

const AMBIENT_LABELS: Record<AmbientTrack, string> = {
  ambient: 'Drone Meditativo 🎵',
  rain: 'Chuva Suave 🌧️',
  wind: 'Ruído Rosa 〰️',
  forest: 'Floresta 🌿',
  waves: 'Ondas do Mar 🌊',
  binaural_alpha: 'Binaural Alpha 🎧',
  binaural_theta: 'Binaural Theta 🧠',
  campfire: 'Fogueira 🔥',
  singing_bowls: 'Tigelas Cantantes 🔔',
  white_noise: 'Ruído Branco ⚪',
  crickets: 'Grilos Noturnos 🌙',
};

const AMBIENT_OPTIONS: AmbientTrack[] = [
  'ambient', 'rain', 'wind', 'forest', 'waves',
  'binaural_alpha', 'binaural_theta',
  'campfire', 'singing_bowls', 'white_noise', 'crickets',
];
const EXPERIENCE_OPTIONS: ExperienceLevel[] = ['beginner', 'regular', 'experienced'];
const MORNING_REMINDER_ID = 'reminder-morning';
const AFTERNOON_REMINDER_ID = 'reminder-afternoon';

type Props = NativeStackScreenProps<SettingsStackParamList, 'SettingsMain'>;

export function SettingsScreen({ navigation }: Props) {
  const userEmail = useAuthStore((state) => state.userEmail);
  const isGuest = useAuthStore((state) => state.isGuest);
  const logout = useAuthStore((state) => state.logout);
  const {
    transitionSound,
    showTimer,
    experienceLevel,
    ambientEnabled,
    ambientTrack,
    ambientVolume,
    ambientMuted,
    morningReminder,
    afternoonReminder,
    setTransitionSound,
    setShowTimer,
    setExperienceLevel,
    setAmbientEnabled,
    setAmbientTrack,
    setAmbientVolume,
    toggleAmbientMuted,
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

  const handleLogout = useCallback(() => {
    Alert.alert('Sair da conta', 'Deseja encerrar a sessão demo neste dispositivo?', [
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
          Configurações
        </MinimalText>

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
          description="Som curto entre fases da sessão"
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

        <SettingRow
          type="toggle"
          label="Som ambiente"
          description="Trilha contínua durante a meditação"
          value={ambientEnabled}
          onValueChange={setAmbientEnabled}
        />

        <SettingRow
          type="select"
          label="Trilha ambiente"
          description="Escolha a textura sonora da prática"
          value={AMBIENT_LABELS[ambientTrack]}
          onPress={cycleAmbientTrack}
        />

        <SettingRow
          type="toggle"
          label="Silenciar ambiente"
          description={ambientMuted ? 'Ativado' : 'Desativado'}
          value={ambientMuted}
          onValueChange={toggleAmbientMuted}
        />

        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Volume ambiente: {Math.round(ambientVolume * 100)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={ambientVolume}
            disabled={!ambientEnabled || ambientMuted}
            onValueChange={(value) => setAmbientVolume(value)}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.textSecondary}
            thumbTintColor={colors.primary}
          />
        </View>

        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Companion — Tema Visual
        </MinimalText>

        <MinimalText variant="caption" color={colors.textSecondary} style={styles.sectionDesc}>
          Desbloqueie novos temas com sequência de dias ou XP acumulado.
        </MinimalText>

        <View style={styles.themeSelectorContainer}>
          <ThemeSelector />
        </View>

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

        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Legal
        </MinimalText>

        <SettingRow
          type="navigate"
          label="Termos de Uso"
          onPress={() => navigation.navigate('Terms' as any)}
        />

        <SettingRow
          type="navigate"
          label="Política de Privacidade"
          onPress={() => navigation.navigate('Privacy' as any)}
        />

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

        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Conta
        </MinimalText>

        <SettingRow
          type="navigate"
          label={isGuest ? 'Modo Convidado' : 'Conta demo ativa'}
          description={isGuest ? 'Sem email vinculado' : userEmail || 'demo@mtimer.app'}
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
            M-Timer v1.0.2
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
  sliderRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  footer: {
    marginTop: spacing.xxl,
    gap: spacing.xs,
    paddingBottom: spacing.xl,
  },
  sectionDesc: {
    marginBottom: spacing.sm,
    opacity: 0.8,
  },
  themeSelectorContainer: {
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.sm,
  },
});
