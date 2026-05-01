import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MinimalText } from '../../components/ui/MinimalText';
import { useUserStore } from '../../store/userStore';
import { useCompanionStore } from '../../store/companionStore';
import { useHistoryStore } from '../../store/historyStore';
import {
  COMPANION_THEMES,
  isThemeUnlocked,
  type ThemeId,
} from '../../types/companionTheme';
import { colors, spacing } from '../../core/theme';

const THEME_ORDER: ThemeId[] = ['natureza', 'oceano', 'floresta', 'montanha', 'aurora'];

export function ThemeSelector() {
  const activeTheme = useUserStore((s) => s.activeTheme);
  const setActiveTheme = useUserStore((s) => s.setActiveTheme);
  const xp = useCompanionStore((s) => s.xp);
  const currentStreak = useHistoryStore((s) => s.getStats().currentStreak);

  const handleSelect = useCallback(
    (id: ThemeId) => {
      const theme = COMPANION_THEMES[id];
      if (!isThemeUnlocked(theme, currentStreak, xp)) return;
      setActiveTheme(id);
    },
    [setActiveTheme, currentStreak, xp]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {THEME_ORDER.map((id) => {
        const theme = COMPANION_THEMES[id];
        const unlocked = isThemeUnlocked(theme, currentStreak, xp);
        const active = activeTheme === id;

        return (
          <TouchableOpacity
            key={id}
            onPress={() => handleSelect(id)}
            activeOpacity={unlocked ? 0.7 : 0.4}
            style={[
              styles.card,
              { borderColor: theme.colors.rim },
              active && styles.cardActive,
              !unlocked && styles.cardLocked,
            ]}
          >
            {/* Color preview circle */}
            <View
              style={[
                styles.preview,
                { backgroundColor: theme.colors.body },
              ]}
            >
              <View
                style={[
                  styles.previewGlow,
                  { backgroundColor: theme.colors.glow },
                ]}
              />
              <MinimalText style={styles.emoji}>{theme.emoji}</MinimalText>
            </View>

            <MinimalText
              variant="caption"
              align="center"
              color={unlocked ? colors.primary : colors.textSecondary}
              style={active ? { ...styles.name, fontWeight: '700' as const } : styles.name}
            >
              {theme.name}
            </MinimalText>

            {!unlocked && (
              <MinimalText
                variant="caption"
                align="center"
                color={colors.textSecondary}
                style={styles.lockLabel}
              >
                🔒 {theme.unlock.description}
              </MinimalText>
            )}

            {active && (
              <View style={[styles.activeDot, { backgroundColor: theme.colors.rim }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  card: {
    width: 90,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    gap: 4,
  },
  cardActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLocked: {
    opacity: 0.55,
  },
  preview: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewGlow: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    opacity: 0.5,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 11,
    marginTop: 2,
  },
  lockLabel: {
    fontSize: 9,
    opacity: 0.8,
    textAlign: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
