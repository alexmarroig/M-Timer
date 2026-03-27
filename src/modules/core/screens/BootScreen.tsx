import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing } from '../../../core/theme';

type BootScreenProps = {
  hasError: boolean;
  timedOut: boolean;
};

export function BootScreen({ hasError, timedOut }: BootScreenProps) {
  const description = hasError
    ? 'Não foi possível carregar o app. Tentando novamente...'
    : timedOut
      ? 'Inicialização mais lenta que o normal. Finalizando carregamento...'
      : 'Preparando sua sessão...';

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <MinimalText variant="subheading" align="center" style={styles.title}>
        Abrindo M-Timer
      </MinimalText>
      <MinimalText variant="caption" align="center" color={colors.textSecondary}>
        {description}
      </MinimalText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    color: colors.primary,
  },
});
