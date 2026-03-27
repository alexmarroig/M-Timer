import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { MinimalText } from '../../../components/ui/MinimalText';
import { PresetCard } from '../components/PresetCard';
import { StreakBadge } from '../components/StreakBadge';
import { CompanionCharacter } from '../../companion/CompanionCharacter';
import { useSessionStore } from '../../../store/sessionStore';
import { useHistoryStore } from '../../../store/historyStore';
import { colors, spacing } from '../../../core/theme';
import { SessionTemplate } from '../../../types/session';
import type { SessionStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<SessionStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const templates = useSessionStore((s) => s.templates);
  const getDefault = useSessionStore((s) => s.getDefault);
  const getStats = useHistoryStore((s) => s.getStats);

  const stats = getStats();
  const defaultTemplate = getDefault();

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
            Sua prática diária de meditação
          </MinimalText>
        </View>

        {/* Companion */}
        <View style={styles.companionSection}>
          <CompanionCharacter size={110} showLevel />
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

        {/* Presets */}
        <View style={styles.section}>
          <MinimalText variant="subheading" style={styles.sectionTitle}>
            Presets
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
              {stats.totalMinutes} min no total · {stats.weeklyMinutes} min esta semana
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
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
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
