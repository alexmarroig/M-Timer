import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingPage } from '../components/OnboardingPage';
import type { OnboardingStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <OnboardingPage
      title="M-Timer"
      description="Seu companheiro de pratica para Meditacao Transcendental. Sessoes estruturadas em 3 fases para uma experiencia completa."
      buttonTitle="Comecar"
      onNext={() => navigation.navigate('Experience')}
    />
  );
}
