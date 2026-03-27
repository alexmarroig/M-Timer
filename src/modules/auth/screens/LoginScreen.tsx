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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

function isEmailValid(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('demo@mtimer.app');
  const [password, setPassword] = useState('123456');
  const [submitted, setSubmitted] = useState(false);

  const { login, isLoading, error, clearError, isOffline } = useAuthStore();

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

  const passwordError = useMemo(() => {
    if (!submitted) {
      return null;
    }

    if (!password.trim()) {
      return 'Digite sua senha.';
    }

    return null;
  }, [password, submitted]);

  const canSubmit = !emailError && !passwordError;

  const handleLogin = async () => {
    setSubmitted(true);
    clearError();

    if (!canSubmit) {
      return;
    }

    await login(email, password);
  };

  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <MinimalText variant="heading">Entrar</MinimalText>
            <MinimalText color={colors.textSecondary}>
              Acesse sua conta para sincronizar sessões e histórico.
            </MinimalText>
          </View>

          <Card style={styles.formCard}>
            <MinimalText variant="caption" style={styles.inputLabel}>
              E-mail
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

            <MinimalText variant="caption" style={{ ...styles.inputLabel, ...styles.fieldGap }}>
              Senha
            </MinimalText>
            <TextInput
              value={password}
              secureTextEntry
              style={styles.input}
              placeholder="••••••"
              placeholderTextColor={colors.textSecondary}
              onChangeText={setPassword}
            />
            {passwordError ? <MinimalText color={colors.error}>{passwordError}</MinimalText> : null}

            {error ? (
              <MinimalText color={colors.error} style={styles.fieldGap}>
                {error}
              </MinimalText>
            ) : null}

            {isOffline ? (
              <MinimalText variant="caption" color={colors.textSecondary} style={styles.fieldGap}>
                Modo offline: se você já estava autenticado, sua sessão local permanece ativa.
              </MinimalText>
            ) : null}

            <ButtonPrimary
              title="Entrar"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.submit}
            />

            <ButtonPrimary
              title="Esqueci minha senha"
              variant="ghost"
              onPress={() => navigation.navigate('ForgotPassword')}
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
  fieldGap: {
    marginTop: spacing.xs,
  },
  submit: {
    marginTop: spacing.md,
  },
});
