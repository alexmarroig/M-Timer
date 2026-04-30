import React, { useRef, useCallback } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 30,
      bounciness: 2,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 15,
      bounciness: 12,
    }).start();
  }, [scaleAnim]);

  return (
    <TouchableWithoutFeedback
      onPress={() => onPress(template)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.card,
          isActive && styles.activeCard,
          { transform: [{ scale: scaleAnim }] },
        ]}
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
      </Animated.View>
    </TouchableWithoutFeedback>
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
