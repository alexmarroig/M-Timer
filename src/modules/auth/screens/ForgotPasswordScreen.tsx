import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { Card } from '../../../components/ui/Card';
import type { AuthStackParamList } from '../../../core/navigation/types';
import { borderRadius, colors, spacing } from '../../../core/theme';
import { useAuthStore } from '../../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

function isEmailValid(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('demo@mtimer.app');
  const [submitted, setSubmitted] = useState(false);
  const { sendPasswordResetEmail, isLoading, error, clearError } = useAuthStore();

  const emailError = useMemo(() => {
    if (!submitted) {
      return null;
    }

    if (!email.trim()) {
      return 'Digite seu e-mail.';
    }

    if (!isEmailValid(email)) {
      return 'Digite um e-mail válido.';
    }

    return null;
  }, [email, submitted]);

  const handleSendEmail = async () => {
    setSubmitted(true);
    clearError();

    if (emailError) {
      return;
    }

    const sent = await sendPasswordResetEmail(email);

    if (sent) {
      navigation.replace('ResetPasswordSent', {
        email: email.trim().toLowerCase(),
      });
    }
  };

  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <MinimalText variant="heading">Recuperar senha</MinimalText>
            <MinimalText color={colors.textSecondary}>
              Enviaremos um link para redefinir sua senha.
            </MinimalText>
          </View>

          <Card style={styles.formCard}>
            <MinimalText variant="caption" style={styles.inputLabel}>
              E-mail da conta
            </MinimalText>
            <TextInput
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              style={styles.input}
              placeholder="voce@email.com"
              placeholderTextColor={colors.textSecondary}
              onChangeText={setEmail}
            />

            {emailError ? <MinimalText color={colors.error}>{emailError}</MinimalText> : null}
            {error ? <MinimalText color={colors.error}>{error}</MinimalText> : null}

            <ButtonPrimary
              title="Enviar e-mail"
              onPress={handleSendEmail}
              loading={isLoading}
              style={styles.submit}
            />

            <ButtonPrimary
              title="Voltar ao login"
              variant="secondary"
              onPress={() => navigation.goBack()}
            />
          </Card>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  formCard: {
    gap: spacing.sm,
  },
  inputLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    minHeight: 48,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  submit: {
    marginTop: spacing.md,
  },
});
