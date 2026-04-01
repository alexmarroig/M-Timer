import React from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing } from '../../../core/theme';

interface BaseProps {
  label: string;
  description?: string;
}

interface NavigateProps extends BaseProps {
  type: 'navigate';
  onPress: () => void;
}

interface ToggleProps extends BaseProps {
  type: 'toggle';
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface SelectProps extends BaseProps {
  type: 'select';
  value: string;
  onPress: () => void;
}

type Props = NavigateProps | ToggleProps | SelectProps;

export function SettingRow(props: Props) {
  const { label, description } = props;

  const content = (
    <View style={styles.container}>
      <View style={styles.left}>
        <MinimalText variant="body">{label}</MinimalText>
        {description && (
          <MinimalText variant="caption" color={colors.textSecondary}>
            {description}
          </MinimalText>
        )}
      </View>
      <View style={styles.right}>
        {props.type === 'toggle' && (
          <Switch
            value={props.value}
            onValueChange={props.onValueChange}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.surface}
          />
        )}
        {props.type === 'select' && (
          <MinimalText variant="body" color={colors.primary}>
            {props.value}
          </MinimalText>
        )}
        {props.type === 'navigate' && (
          <MinimalText variant="body" color={colors.textSecondary}>
            {'>'}
          </MinimalText>
        )}
      </View>
    </View>
  );

  if (props.type === 'navigate' || props.type === 'select') {
    return (
      <TouchableOpacity onPress={props.onPress} activeOpacity={0.6}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  left: {
    flex: 1,
    marginRight: spacing.md,
  },
  right: {
    alignItems: 'flex-end',
  },
});
