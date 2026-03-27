import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { colors, typography } from '../../core/theme';

interface Props {
  children: React.ReactNode;
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'timer' | 'timerSmall';
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
}

export function MinimalText({
  children,
  variant = 'body',
  color,
  align = 'left',
  style,
}: Props) {
  return (
    <Text
      style={[
        styles.base,
        typography[variant],
        { textAlign: align },
        color ? { color } : styles[`color_${variant}`],
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },
  color_heading: {
    color: colors.textPrimary,
  },
  color_subheading: {
    color: colors.textPrimary,
  },
  color_body: {
    color: colors.textPrimary,
  },
  color_caption: {
    color: colors.textSecondary,
  },
  color_timer: {
    color: colors.primary,
  },
  color_timerSmall: {
    color: colors.textSecondary,
  },
});
