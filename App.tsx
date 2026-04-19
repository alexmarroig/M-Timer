import React from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/core/navigation/AppNavigator';
import { useRememberAudioStatus } from './src/hooks/useRememberAudioStatus';
import { useCompanionDecay } from './src/hooks/useCompanionDecay';

// Global error handler for debugging production crashes
if (!__DEV__) {
  const defaultHandler = (ErrorUtils as any).getGlobalHandler();
  (ErrorUtils as any).setGlobalHandler((error: any, isFatal: boolean) => {
    Alert.alert(
      'Ops! Ocorreu um erro',
      `Erro: ${error.message}\n${isFatal ? 'O app pode fechar.' : ''}`,
      [{ text: 'OK' }]
    );
    defaultHandler(error, isFatal);
  });
}

export default function App() {
  useRememberAudioStatus();
  useCompanionDecay();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
