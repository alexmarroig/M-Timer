import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingPage } from '../components/OnboardingPage';
import type { OnboardingStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'MantraInfo'>;

export function MantraInfoScreen({ navigation }: Props) {
  return (
    <OnboardingPage
      title="O Uso do Mantra"
      description="Na MT, o mantra é um som mental simples. Não é necessário esforço ou concentração. Se você se perder em pensamentos, apenas retorne gentilmente ao mantra."
      buttonTitle="Entendi"
      onNext={() => navigation.navigate('Experience')}
    />
  );
}
