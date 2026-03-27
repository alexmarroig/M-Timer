import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { SettingRow } from '../components/SettingRow';
import { useUserStore } from '../../../store/userStore';
import { useAuthStore } from '../../../store/authStore';
import { colors, spacing } from '../../../core/theme';
import type { SettingsStackParamList } from '../../../core/navigation/types';

type TransitionSoundLabel = Record<string, string>;
const SOUND_LABELS: TransitionSoundLabel = {
  bell: 'Sino',
  vibration: 'Vibração',
  none: 'Nenhum',
};

const SOUND_OPTIONS = ['bell', 'vibration', 'none'] as const;

type Props = NativeStackScreenProps<SettingsStackParamList, 'SettingsMain'>;

export function SettingsScreen({ navigation }: Props) {
  const logout = useAuthStore((s) => s.logout);

  const {
    transitionSound,
    showTimer,
    morningReminder,
    afternoonReminder,
    setTransitionSound,
    setShowTimer,
    setMorningReminder,
    setAfternoonReminder,
  } = useUserStore();

  const cycleSound = useCallback(() => {
    const currentIndex = SOUND_OPTIONS.indexOf(transitionSound);
    const nextIndex = (currentIndex + 1) % SOUND_OPTIONS.length;
    setTransitionSound(SOUND_OPTIONS[nextIndex]);
  }, [transitionSound, setTransitionSound]);

  const toggleMorningReminder = useCallback(
    (enabled: boolean) => {
      setMorningReminder({ ...morningReminder, enabled });
    },
    [morningReminder, setMorningReminder]
  );

  const toggleAfternoonReminder = useCallback(
    (enabled: boolean) => {
      setAfternoonReminder({ ...afternoonReminder, enabled });
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

        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Conta
        </MinimalText>

        <SettingRow
          type="navigate"
          label="Sair"
          description="Encerra a sessão neste dispositivo"
          onPress={() =>
            Alert.alert('Sair da conta', 'Deseja realmente sair?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', style: 'destructive', onPress: logout },
            ])
          }
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
