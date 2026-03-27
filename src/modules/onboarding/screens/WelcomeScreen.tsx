import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingPage } from '../components/OnboardingPage';
import type { OnboardingStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <OnboardingPage
      title="M-Timer"
      description="Seu companheiro de prática para Meditação Transcendental. Sessões estruturadas em 3 fases para uma experiência completa."
      buttonTitle="Começar"
      onNext={() => navigation.navigate('Experience')}
    />
  );
}
