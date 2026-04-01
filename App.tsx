import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/core/navigation/AppNavigator';
import { useRememberAudioStatus } from './src/hooks/useRememberAudioStatus';

export default function App() {
  useRememberAudioStatus();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
