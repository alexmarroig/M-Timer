import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { Card } from '../../../components/ui/Card';
import { ButtonPrimary } from '../../../components/ui/ButtonPrimary';
import { colors, spacing } from '../../../core/theme';
import type { AuthStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPasswordSent'>;

export function ResetPasswordSentScreen({ route, navigation }: Props) {
  return (
    <ScreenContainer edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <MinimalText variant="heading" align="center">
            Verifique seu e-mail
          </MinimalText>

          <MinimalText align="center" color={colors.textSecondary}>
            Enviamos as instruções de redefinição para:
          </MinimalText>

          <MinimalText align="center">{route.params.email}</MinimalText>

          <MinimalText variant="caption" align="center" color={colors.textSecondary}>
            Se estiver offline, tente novamente quando sua conexão voltar.
          </MinimalText>

          <ButtonPrimary
            title="Voltar ao login"
            onPress={() => navigation.popToTop()}
            style={styles.button}
          />
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    gap: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
});
