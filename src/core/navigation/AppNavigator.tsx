import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
        options={{ presentation: 'fullScreenModal', gestureEnabled: true }}
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
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
      }}
    >
      <OnboardingStack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ title: 'Boas-vindas' }}
      />
      <OnboardingStack.Screen
        name="Experience"
        component={ExperienceScreen}
        options={{ title: 'Experiência', headerBackTitle: 'Voltar' }}
      />
      <OnboardingStack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ title: 'Rotina', headerBackTitle: 'Voltar' }}
      />
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
        options={{
          tabBarLabel: 'Sessão',
          tabBarIcon: ({ focused }) => <TabIcon label="●" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ focused }) => <TabIcon label="◷" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackScreen}
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

  return (
    <NavigationContainer>
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
