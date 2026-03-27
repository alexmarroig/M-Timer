import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing, borderRadius } from '../../../core/theme';
import { useAuthStore } from '../../../store/authStore';
import { DEMO_ACCOUNT } from '../../../types/auth';

export function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState<string>(DEMO_ACCOUNT.email);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNT.password);

  const handleLogin = () => {
    const success = login(email, password);
    if (!success) {
      Alert.alert(
        'Login invalido',
        'Use as credenciais demo exibidas na tela para acessar o app.'
      );
    }
  };

  const fillDemoAccess = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
  };

  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <View style={styles.hero}>
          <Image source={require('../../../../assets/icon.png')} style={styles.logo} />
          <MinimalText variant="heading" align="center">
            M-Timer
          </MinimalText>
          <MinimalText variant="body" color={colors.textSecondary} align="center">
            Meditacao guiada com login demo liberado para testes.
          </MinimalText>
        </View>

        <View style={styles.card}>
          <View style={styles.badge}>
            <MinimalText variant="caption" color={colors.primary}>
              Acesso pronto para usar
            </MinimalText>
          </View>

          <MinimalText variant="subheading">Entrar</MinimalText>
          <MinimalText variant="body" color={colors.textSecondary} style={styles.copy}>
            Use o login demo abaixo para abrir o app imediatamente.
          </MinimalText>

          <View style={styles.fieldGroup}>
            <MinimalText variant="caption" color={colors.textSecondary}>
              Email
            </MinimalText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="demo@mtimer.app"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <MinimalText variant="caption" color={colors.textSecondary}>
              Senha
            </MinimalText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Respira123"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
            />
          </View>

          <View style={styles.credentialsBox}>
            <MinimalText variant="caption" color={colors.textSecondary}>
              Login demo
            </MinimalText>
            <MinimalText variant="body">demo@mtimer.app</MinimalText>
            <MinimalText variant="caption" color={colors.textSecondary} style={styles.passwordLabel}>
              Senha demo
            </MinimalText>
            <MinimalText variant="body">Respira123</MinimalText>
          </View>

          <ButtonPrimary
            title="Entrar no app"
            onPress={handleLogin}
            size="large"
            style={styles.primaryButton}
          />

          <ButtonPrimary
            title="Preencher demo"
            onPress={fillDemoAccess}
            variant="secondary"
            size="large"
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.accentLight,
  },
  copy: {
    marginTop: -spacing.sm,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
  },
  credentialsBox: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  passwordLabel: {
    marginTop: spacing.sm,
  },
  primaryButton: {
    marginTop: spacing.xs,
  },
});
