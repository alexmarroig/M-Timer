import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/core/navigation/AppNavigator';
import { BootScreen } from './src/modules/core/screens/BootScreen';
import { useUserStore } from './src/store/userStore';
import { useSessionStore } from './src/store/sessionStore';
import { useHistoryStore } from './src/store/historyStore';
import { notificationService } from './src/services/notifications/notificationService';
import { restoreTimerState } from './src/services/timerEngine/timerBootstrap';

const BOOT_TIMEOUT_MS = 5000;
const BOOT_RETRY_DELAY_MS = 1000;

type BootstrapState = 'loading' | 'ready';

async function runBootstrapTasks() {
  await Promise.all([
    useUserStore.persist.rehydrate(),
    useSessionStore.persist.rehydrate(),
    useHistoryStore.persist.rehydrate(),
    notificationService.requestPermissions().catch(() => false),
    restoreTimerState(),
  ]);
}

export default function App() {
  const [bootstrapState, setBootstrapState] = useState<BootstrapState>('loading');
  const [bootError, setBootError] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setTimedOut(true);
      }
    }, BOOT_TIMEOUT_MS);

    const bootstrap = async () => {
      try {
        await runBootstrapTasks();
      } catch {
        if (isMounted) {
          setBootError(true);
          await new Promise((resolve) => setTimeout(resolve, BOOT_RETRY_DELAY_MS));
          await runBootstrapTasks();
        }
      } finally {
        clearTimeout(fallbackTimer);
        if (!isMounted) return;
        setBootstrapState('ready');
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (bootstrapState !== 'ready') return;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [bootstrapState, opacity]);

  const shouldShowBoot = useMemo(() => bootstrapState !== 'ready', [bootstrapState]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />

      {shouldShowBoot ? (
        <BootScreen hasError={bootError} timedOut={timedOut} />
      ) : (
        <Animated.View style={[styles.navigatorContainer, { opacity }]}>
          <AppNavigator />
        </Animated.View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  navigatorContainer: {
    flex: 1,
  },
});
