import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing } from '../../../core/theme';

export function TermsScreen() {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <MinimalText variant="heading" style={styles.title}>Termos de Uso</MinimalText>

        <MinimalText variant="body" style={styles.text}>
          Bem-vindo ao M-Timer. Ao utilizar nosso aplicativo, você concorda com os seguintes termos:
        </MinimalText>

        <MinimalText variant="subheading" style={styles.subtitle}>1. Finalidade do App</MinimalText>
        <MinimalText variant="body" style={styles.text}>
          O M-Timer é uma ferramenta de cronômetro e acompanhamento para praticantes de Meditação Transcendental. O aplicativo NÃO ensina a técnica de meditação. Recomendamos que você aprenda a técnica com um instrutor certificado.
        </MinimalText>

        <MinimalText variant="subheading" style={styles.subtitle}>2. Uso de Dados</MinimalText>
        <MinimalText variant="body" style={styles.text}>
          Atualmente, o M-Timer armazena seus dados de prática (histórico, XP e preferências) localmente no seu dispositivo. Não somos responsáveis pela perda de dados em caso de desinstalação do app.
        </MinimalText>

        <MinimalText variant="subheading" style={styles.subtitle}>3. Isenção de Responsabilidade</MinimalText>
        <MinimalText variant="body" style={styles.text}>
          A prática de meditação é de responsabilidade do usuário. O app fornece apenas uma estrutura de tempo (2-20-3). Consulte um profissional de saúde se tiver preocupações médicas.
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
