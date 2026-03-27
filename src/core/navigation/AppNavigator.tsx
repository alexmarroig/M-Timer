import React, { useRef } from 'react';
import { NavigationContainer, type NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import { HomeScreen } from '../../modules/session/screens/HomeScreen';
import { PlayerScreen } from '../../modules/session/screens/PlayerScreen';
import { HistoryScreen } from '../../modules/history/screens/HistoryScreen';
import { SettingsScreen } from '../../modules/settings/screens/SettingsScreen';
import { AboutScreen } from '../../modules/settings/screens/AboutScreen';
import { WelcomeScreen } from '../../modules/onboarding/screens/WelcomeScreen';
import { ExperienceScreen } from '../../modules/onboarding/screens/ExperienceScreen';
import { ScheduleScreen } from '../../modules/onboarding/screens/ScheduleScreen';

import { useUserStore } from '../../store/userStore';
import { colors } from '../theme';
import { performanceService } from '../../services/performance/performanceService';

import type {
  SessionStackParamList,
  SettingsStackParamList,
  OnboardingStackParamList,
  TabParamList,
} from './types';

const SessionStack = createNativeStackNavigator<SessionStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Simple text-based tab icons (no icon library dependency)
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {label}
    </Text>
  );
}

function SessionStackScreen() {
  return (
    <SessionStack.Navigator screenOptions={{ headerShown: false }}>
      <SessionStack.Screen name="Home" component={HomeScreen} />
      <SessionStack.Screen
        name="Player"
        component={PlayerScreen}
        options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
      />
    </SessionStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen
        name="About"
        component={AboutScreen}
        options={{
          headerShown: true,
          title: 'Sobre',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerShadowVisible: false,
        }}
      />
    </SettingsStack.Navigator>
  );
}

function OnboardingFlow() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="Experience" component={ExperienceScreen} />
      <OnboardingStack.Screen name="Schedule" component={ScheduleScreen} />
    </OnboardingStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="SessionTab"
        component={SessionStackScreen}
        listeners={{
          tabPress: () => {
            void performanceService.markFirstInteraction('tab_session');
            void performanceService.logEvent('navigation_tab_press', { tab: 'SessionTab' });
          },
        }}
        options={{
          tabBarLabel: 'Sessão',
          tabBarIcon: ({ focused }) => <TabIcon label="●" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        listeners={{
          tabPress: () => {
            void performanceService.markFirstInteraction('tab_history');
            void performanceService.logEvent('navigation_tab_press', { tab: 'HistoryTab' });
          },
        }}
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ focused }) => <TabIcon label="◷" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackScreen}
        listeners={{
          tabPress: () => {
            void performanceService.markFirstInteraction('tab_settings');
            void performanceService.logEvent('navigation_tab_press', { tab: 'SettingsTab' });
          },
        }}
        options={{
          tabBarLabel: 'Config',
          tabBarIcon: ({ focused }) => <TabIcon label="⚙" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding);
  const navigationRef = useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);
  const previousRouteRef = useRef<string | undefined>(undefined);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
        previousRouteRef.current = currentRoute;

        if (currentRoute) {
          void performanceService.markColdStartReady(currentRoute);
          void performanceService.logEvent('navigation_ready', { route: currentRoute });
        }
      }}
      onStateChange={() => {
        const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
        const previousRoute = previousRouteRef.current;

        if (currentRoute && currentRoute !== previousRoute) {
          previousRouteRef.current = currentRoute;
          void performanceService.markFirstInteraction(`route_change_${currentRoute}`);
          void performanceService.logEvent('navigation_route_change', {
            from: previousRoute ?? 'unknown',
            to: currentRoute,
          });
        }
      }}
    >
      {hasCompletedOnboarding ? <MainTabs /> : <OnboardingFlow />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  tabIconFocused: {
    color: colors.primary,
  },
});
