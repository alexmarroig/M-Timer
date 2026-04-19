import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing } from '../../../core/theme';

export function PrivacyScreen() {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <MinimalText variant="heading" style={styles.title}>Política de Privacidade</MinimalText>

        <MinimalText variant="body" style={styles.text}>
          Sua privacidade é importante para nós. Esta política descreve como lidamos com suas informações.
        </MinimalText>

        <MinimalText variant="subheading" style={styles.subtitle}>1. Coleta de Informações</MinimalText>
        <MinimalText variant="body" style={styles.text}>
          O M-Timer opera principalmente de forma offline. Coletamos apenas dados técnicos anônimos de crash para melhorar a estabilidade do app. Seus dados de meditação ficam salvos apenas no seu celular.
        </MinimalText>

        <MinimalText variant="subheading" style={styles.subtitle}>2. Notificações</MinimalText>
        <MinimalText variant="body" style={styles.text}>
          Solicitamos permissão para enviar lembretes de prática e notificações do sistema Companion. Você pode desativar essas notificações a qualquer momento nas configurações do sistema.
        </MinimalText>

        <MinimalText variant="subheading" style={styles.subtitle}>3. Segurança</MinimalText>
        <MinimalText variant="body" style={styles.text}>
          Como os dados são locais, a segurança deles depende da segurança do seu próprio dispositivo.
        </MinimalText>

        <MinimalText variant="caption" style={styles.footer}>
          Última atualização: Março de 2024
        </MinimalText>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  text: {
    lineHeight: 22,
    color: colors.textSecondary,
  },
  footer: {
    marginTop: spacing.xxl,
    opacity: 0.5,
  },
});
