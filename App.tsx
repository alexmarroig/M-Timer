import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/core/navigation/AppNavigator';
import { performanceService } from './src/services/performance/performanceService';

export default function App() {
  useEffect(() => {
    void performanceService.logEvent('app_bootstrap_start', {
      started_at_ms: performanceService.getAppStartTimestamp(),
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
