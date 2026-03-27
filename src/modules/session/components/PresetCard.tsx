import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SessionTemplate } from '../../../types/session';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing, borderRadius } from '../../../core/theme';
import { phaseShortLabel, formatDuration, totalPhaseDuration } from '../../../core/utils/time';

interface Props {
  template: SessionTemplate;
  onPress: (template: SessionTemplate) => void;
  isActive?: boolean;
}

export function PresetCard({ template, onPress, isActive }: Props) {
  const total = totalPhaseDuration(template.phases);

  return (
    <TouchableOpacity
      style={[styles.card, isActive && styles.activeCard]}
      onPress={() => onPress(template)}
      activeOpacity={0.7}
    >
      <MinimalText
        variant="body"
        color={isActive ? colors.textInverse : colors.textPrimary}
        style={styles.name}
      >
        {template.name}
      </MinimalText>
      <MinimalText
        variant="caption"
        color={isActive ? colors.accentLight : colors.textSecondary}
      >
        {phaseShortLabel(template.phases)} · {formatDuration(total)}
      </MinimalText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 130,
  },
  activeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  name: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
});
