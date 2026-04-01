import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { Card } from '../../../components/ui/Card';
import { MinimalText } from '../../../components/ui/MinimalText';
import { Companion } from '../../../components/Companion';

import { useCompanion } from '../../../hooks/useCompanion';
import { PresetCard } from '../components/PresetCard';
import { StreakBadge } from '../components/StreakBadge';
import { CompanionCharacter } from '../../companion/CompanionCharacter';

import { useAuthStore } from '../../../store/authStore';
import { useSessionStore } from '../../../store/sessionStore';
import { useUserStore } from '../../../store/userStore';

import { colors, spacing, borderRadius } from '../../../core/theme';

import { SessionTemplate } from '../../../types/session';
import type { ExperienceLevel } from '../../../types/user';
import type { SessionStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<SessionStackParamList, 'Home'>;

const HOME_COPY: Record<
  ExperienceLevel,
  { subtitle: string; presetTitle: string }
> = {
  beginner: {
    subtitle: 'vamos consolidar sua pratica com sessoes leves e consistentes.',
    presetTitle: 'Presets para comecar',
  },
  regular: {
    subtitle: 'vamos manter sua pratica diaria de meditacao.',
    presetTitle: 'Presets',
  },
  experienced: {
    subtitle: 'vamos manter profundidade e constancia na pratica.',
    presetTitle: 'Presets para aprofundar',
  },
};

export function HomeScreen({ navigation }: Props) {
  const displayName = useAuthStore((state) => state.displayName);
  const templates = useSessionStore((state) => state.templates);
  const getDefault = useSessionStore((state) => state.getDefault);
  const experienceLevel = useUserStore((state) => state.experienceLevel);

  const { stats, profile, companionState } = useCompanion({
    placement: 'home',
  });

  const defaultTemplate = getDefault();
  const homeCopy = HOME_COPY[experienceLevel];

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
            {displayName
              ? `${displayName}, ${homeCopy.subtitle}`
              : `Sua pratica diaria de meditacao: ${homeCopy.subtitle}`}
          </MinimalText>
        </View>

        {/* Companion Character */}
        <View style={styles.companionSection}>
          <CompanionCharacter size={110} showLevel />
        </View>

        {/* Companion Card */}
        <View style={styles.section}>
          <Card style={styles.companionCard}>
            <View style={styles.companionRow}>
              <View style={styles.companionVisual}>
                <Companion
                  placement="home"
                  phase={companionState.phase}
                  evolutionTier={profile.evolutionTier}
                  calmness={companionState.calmness}
                  state={companionState}
                />
              </View>

              <View style={styles.companionCopy}>
                <MinimalText variant="subheading">
                  Companion em evolucao
                </MinimalText>

                <MinimalText variant="caption" color={colors.textSecondary}>
                  Nivel {profile.currentLevel} - {profile.levelLabel}
                </MinimalText>

                <MinimalText variant="body" style={styles.metricText}>
                  {profile.xpTotal} XP acumulado
                </MinimalText>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.max(
                          profile.progressWithinLevel * 100,
                          6
                        )}%`,
                      },
                    ]}
                  />
                </View>

                <MinimalText variant="caption" color={colors.textSecondary}>
                  {profile.nextLevelLabel
                    ? `${profile.xpToNextLevel} XP para ${profile.nextLevelLabel}`
                    : 'Seu companion entrou em estado integrado.'}
                </MinimalText>

                <MinimalText
                  variant="caption"
                  color={colors.textSecondary}
                  style={styles.statusText}
                >
                  {stats.currentStreak > 0
                    ? `${stats.currentStreak} dias de constancia e ${stats.sessionsToday} sessoes hoje.`
                    : 'Complete sua primeira sessao para despertar mais brilho.'}
                </MinimalText>
              </View>
            </View>
          </Card>
        </View>

        {/* CTA */}
        <ButtonPrimary
          title="Iniciar Sessao"
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
            {templates.map((template) => (
              <PresetCard
                key={template.id}
                template={template}
                onPress={handlePresetPress}
                isActive={template.isDefault}
              />
            ))}
          </ScrollView>
        </View>

        {/* Stats footer */}
        {stats.totalSessions > 0 && (
          <View style={styles.section}>
            <MinimalText variant="caption" color={colors.textSecondary}>
              {stats.totalMinutes} min no total - {stats.weeklyMinutes} min nesta semana -
              multiplicador atual {profile.streakMultiplier.toFixed(2)}x
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
    marginBottom: spacing.md,
  },
  companionSection: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
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
  companionCard: {
    borderRadius: borderRadius.lg,
  },
  companionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  companionVisual: {
    width: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companionCopy: {
    flex: 1,
  },
  metricText: {
    marginTop: spacing.sm,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  statusText: {
    marginTop: spacing.xs,
  },
});