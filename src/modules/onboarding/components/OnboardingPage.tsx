import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MinimalText } from '../../../components/ui/MinimalText';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { colors, spacing } from '../../../core/theme';

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
  buttonTitle: string;
  onNext: () => void;
  secondaryButtonTitle?: string;
  onSecondary?: () => void;
}

export function OnboardingPage({
  title,
  description,
  children,
  buttonTitle,
  onNext,
  secondaryButtonTitle,
  onSecondary,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MinimalText variant="heading" align="center" color={colors.primary}>
          {title}
        </MinimalText>
        <MinimalText
          variant="body"
          align="center"
          color={colors.textSecondary}
          style={styles.description}
        >
          {description}
        </MinimalText>
        {children && <View style={styles.children}>{children}</View>}
      </View>

      <View style={styles.buttons}>
        <ButtonPrimary title={buttonTitle} onPress={onNext} size="large" />
        {secondaryButtonTitle && onSecondary && (
          <ButtonPrimary
            title={secondaryButtonTitle}
            onPress={onSecondary}
            variant="ghost"
            size="medium"
            style={styles.secondaryButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginTop: spacing.md,
    maxWidth: 300,
  },
  children: {
    marginTop: spacing.xl,
    width: '100%',
  },
  buttons: {
    gap: spacing.sm,
  },
  secondaryButton: {
    alignSelf: 'center',
  },
});
