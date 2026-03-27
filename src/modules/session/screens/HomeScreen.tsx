import React, { useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { MinimalText } from '../../../components/ui/MinimalText';
import { PresetCard } from '../components/PresetCard';
import { StreakBadge } from '../components/StreakBadge';
import { CompanionPet } from '../components/CompanionPet';
import { useSessionStore } from '../../../store/sessionStore';
import { useHistoryStore } from '../../../store/historyStore';
import { useCompanionStore } from '../../../store/companionStore';
import { GamificationPanel } from '../components/GamificationPanel';
import { useSessionStore } from '../../../store/sessionStore';
import { useHistoryStore } from '../../../store/historyStore';
import { useUserStore } from '../../../store/userStore';
import { colors, spacing } from '../../../core/theme';
import { SessionTemplate } from '../../../types/session';
import type { SessionStackParamList } from '../../../core/navigation/types';
import type { ExperienceLevel } from '../../../types/user';

type Props = NativeStackScreenProps<SessionStackParamList, 'Home'>;

const HOME_COPY: Record<ExperienceLevel, { subtitle: string; presetTitle: string }> = {
  beginner: {
    subtitle: 'Vamos consolidar sua base com sessões mais leves e consistentes.',
    presetTitle: 'Presets recomendados para começar',
  },
  regular: {
    subtitle: 'Sua prática diária de meditação',
    presetTitle: 'Presets',
  },
  experienced: {
    subtitle: 'Fluxo avançado para manter profundidade e constância na prática.',
    presetTitle: 'Presets para aprofundar',
  },
};

export function HomeScreen({ navigation }: Props) {
  const templates = useSessionStore((s) => s.templates);
  const getDefault = useSessionStore((s) => s.getDefault);
  const getStats = useHistoryStore((s) => s.getStats);
  const syncMoodFromStats = useCompanionStore((s) => s.syncMoodFromStats);
  const mood = useCompanionStore((s) => s.mood);
  const level = useCompanionStore((s) => s.level);
  const coins = useCompanionStore((s) => s.coins);
  const xp = useCompanionStore((s) => s.xp);
  const lastRewardXp = useCompanionStore((s) => s.lastRewardXp);
  const lastRewardCoins = useCompanionStore((s) => s.lastRewardCoins);
  const experienceLevel = useUserStore((s) => s.experienceLevel);
  const getGamification = useHistoryStore((s) => s.getGamification);

  const stats = getStats();
  const gamification = getGamification();
  const defaultTemplate = getDefault();
  const homeCopy = HOME_COPY[experienceLevel];

  useEffect(() => {
    syncMoodFromStats(stats);
  }, [stats.currentStreak, stats.sessionsToday, syncMoodFromStats]);

  const handleStartDefault = useCallback(() => {
    if (defaultTemplate) {
      navigation.navigate('Player', { template: defaultTemplate });
    }
  }, [defaultTemplate, navigation]);

  const handlePresetPress = useCallback(
    (template: SessionTemplate) => {
      navigation.navigate('Player', { template });
    },
    [navigation]
  );

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <MinimalText variant="heading">M-Timer</MinimalText>
          <MinimalText variant="body" color={colors.textSecondary}>
            {homeCopy.subtitle}
          </MinimalText>
        </View>

        {/* Main CTA */}
        <ButtonPrimary
          title="Iniciar Sessão"
          onPress={handleStartDefault}
          size="large"
          style={styles.mainButton}
        />

        {/* Streak */}
        <View style={styles.section}>
          <StreakBadge
            currentStreak={stats.currentStreak}
            sessionsToday={stats.sessionsToday}
          />
        </View>

        <View style={styles.section}>
          <CompanionPet
            mood={mood}
            level={level}
            coins={coins}
            xp={xp}
            lastRewardXp={lastRewardXp}
            lastRewardCoins={lastRewardCoins}
          />
        {/* Weekly goals + achievements */}
        <View style={styles.section}>
          <GamificationPanel data={gamification} />
        </View>

        {/* Presets */}
        <View style={styles.section}>
          <MinimalText variant="subheading" style={styles.sectionTitle}>
            {homeCopy.presetTitle}
          </MinimalText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetsRow}
          >
            {templates.map((t) => (
              <PresetCard
                key={t.id}
                template={t}
                onPress={handlePresetPress}
                isActive={t.isDefault}
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick stats */}
        {stats.totalSessions > 0 && (
          <View style={styles.section}>
            <MinimalText variant="caption" color={colors.textSecondary}>
              {stats.totalMinutes} min válidos · {stats.weeklyMinutes} min esta semana · {stats.qualifiedSessions} sessões válidas
            </MinimalText>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  greetingSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  mainButton: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  presetsRow: {
    paddingRight: spacing.lg,
  },
});
