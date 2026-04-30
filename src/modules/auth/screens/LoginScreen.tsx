import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing, borderRadius } from '../../../core/theme';
import { signInWithGoogle } from '../../../services/auth/googleAuthService';
import { useAuthStore } from '../../../store/authStore';
import { DEMO_ACCOUNT } from '../../../types/auth';

export function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const loginGuest = useAuthStore((state) => state.loginGuest);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const demoPassword = useAuthStore((state) => state.demoPassword);
  const [email, setEmail] = useState<string>(DEMO_ACCOUNT.email);
  const [password, setPassword] = useState<string>(demoPassword);
  const [resetEmail, setResetEmail] = useState<string>(DEMO_ACCOUNT.email);
  const [resetCode, setResetCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = () => {
    const success = login(email, password);
    if (!success) {
      Alert.alert(
        'Login inválido',
        'Use as credenciais demo exibidas na tela para acessar o app.'
      );
    }
  };

  const handleGuestLogin = () => {
    loginGuest();
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const profile = await signInWithGoogle();
      loginWithGoogle(profile);
    } catch (error) {
      Alert.alert(
        'Google Login',
        error instanceof Error ? error.message : 'Não foi possível entrar com Google.'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRequestPasswordReset = () => {
    const result = requestPasswordReset(resetEmail);

    if (result.recoveryCode) {
      setResetCode(result.recoveryCode);
    }

    Alert.alert(
      result.ok ? 'Recuperação de senha' : 'Não foi possível recuperar',
      result.recoveryCode
        ? `${result.message}\nCódigo demo: ${result.recoveryCode}`
        : result.message
    );
  };

  const handleResetPassword = () => {
    const result = resetPassword(resetEmail, resetCode, newPassword);

    if (result.ok) {
      setEmail(resetEmail);
      setPassword(newPassword);
      setNewPassword('');
    }

    Alert.alert(result.ok ? 'Senha atualizada' : 'Senha não atualizada', result.message);
  };

  const fillDemoAccess = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(demoPassword);
  };

  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Image source={require('../../../../assets/icon.png')} style={styles.logo} />
            <MinimalText variant="heading" align="center">
              M-Timer
            </MinimalText>
            <MinimalText variant="body" color={colors.textSecondary} align="center">
              Meditação guiada com login demo, convidado e Google.
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
              Use o login demo para abrir imediatamente ou conecte sua conta Google.
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
                placeholder={DEMO_ACCOUNT.password}
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
              <MinimalText variant="body">{demoPassword}</MinimalText>
            </View>

            <ButtonPrimary
              title="Entrar no app"
              onPress={handleLogin}
              size="large"
              style={styles.primaryButton}
            />

            <ButtonPrimary
              title="Entrar como convidado"
              onPress={handleGuestLogin}
              variant="secondary"
              size="large"
            />

            <ButtonPrimary
              title="Entrar com Google"
              onPress={handleGoogleLogin}
              variant="secondary"
              size="large"
              loading={isGoogleLoading}
            />

            <ButtonPrimary
              title="Preencher demo"
              onPress={fillDemoAccess}
              variant="secondary"
              size="large"
            />

            <View style={styles.recoveryBox}>
              <MinimalText variant="subheading">Recuperar senha</MinimalText>

              <View style={styles.fieldGroup}>
                <MinimalText variant="caption" color={colors.textSecondary}>
                  Email da conta
                </MinimalText>
                <TextInput
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="demo@mtimer.app"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.input}
                />
              </View>

              <ButtonPrimary
                title="Gerar codigo"
                onPress={handleRequestPasswordReset}
                variant="secondary"
                size="medium"
              />

              <View style={styles.fieldGroup}>
                <MinimalText variant="caption" color={colors.textSecondary}>
                  Codigo
                </MinimalText>
                <TextInput
                  value={resetCode}
                  onChangeText={setResetCode}
                  keyboardType="number-pad"
                  placeholder="000000"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={6}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <MinimalText variant="caption" color={colors.textSecondary}>
                  Nova senha
                </MinimalText>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Minimo 8 caracteres"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.input}
                />
              </View>

              <ButtonPrimary
                title="Atualizar senha"
                onPress={handleResetPassword}
                variant="primary"
                size="medium"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.xl,
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
  recoveryBox: {
    gap: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  passwordLabel: {
    marginTop: spacing.sm,
  },
  primaryButton: {
    marginTop: spacing.xs,
  },
});
