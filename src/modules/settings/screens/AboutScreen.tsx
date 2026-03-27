import React from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { colors, spacing } from '../../../core/theme';

export function AboutScreen() {
  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <MinimalText variant="heading" style={styles.title}>
          Sobre a Meditação Transcendental
        </MinimalText>

        <MinimalText variant="body" color={colors.textSecondary} style={styles.paragraph}>
          A Meditação Transcendental (MT) é uma técnica simples, natural e sem esforço,
          praticada 20 minutos duas vezes por dia, sentado confortavelmente com os olhos fechados.
        </MinimalText>

        <MinimalText variant="body" color={colors.textSecondary} style={styles.paragraph}>
          A técnica é ensinada por professores certificados em um curso estruturado.
          Este app não substitui o aprendizado com um professor — ele é um companheiro
          de prática para quem já aprendeu a técnica.
        </MinimalText>

        <MinimalText variant="subheading" style={styles.subtitle}>
          Como usar este app
        </MinimalText>

        <MinimalText variant="body" color={colors.textSecondary} style={styles.paragraph}>
          O M-Timer estrutura sua sessão em três fases:{'\n\n'}
          1. Entrada — um momento para desacelerar e se preparar.{'\n'}
          2. Meditação — o tempo de prática com seu mantra.{'\n'}
          3. Saída — um retorno suave à atividade.{'\n\n'}
          Basta escolher um preset e tocar "Iniciar Sessão".
        </MinimalText>

        <ButtonPrimary
          title="Visitar tm.org"
          onPress={() => Linking.openURL('https://www.tm.org')}
          variant="secondary"
          style={styles.link}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    marginBottom: spacing.md,
  },
  link: {
    marginTop: spacing.lg,
  },
});
