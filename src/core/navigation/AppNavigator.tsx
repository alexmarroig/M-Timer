import React from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

import { LoginScreen } from '../../modules/auth/screens/LoginScreen';
import { HomeScreen } from '../../modules/session/screens/HomeScreen';
import { PlayerScreen } from '../../modules/session/screens/PlayerScreen';
import { HistoryScreen } from '../../modules/history/screens/HistoryScreen';
import { SettingsScreen } from '../../modules/settings/screens/SettingsScreen';
import { AboutScreen } from '../../modules/settings/screens/AboutScreen';
import { TermsScreen } from '../../modules/settings/screens/TermsScreen';
import { PrivacyScreen } from '../../modules/settings/screens/PrivacyScreen';
import { WelcomeScreen } from '../../modules/onboarding/screens/WelcomeScreen';
import { MantraInfoScreen } from '../../modules/onboarding/screens/MantraInfoScreen';
import { ExperienceScreen } from '../../modules/onboarding/screens/ExperienceScreen';
import { ScheduleScreen } from '../../modules/onboarding/screens/ScheduleScreen';

import { useAuthStore } from '../../store/authStore';
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

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{label}</Text>;
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
  const commonHeaderOptions = {
    headerShown: true,
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.primary,
    headerShadowVisible: false,
  };

  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen
        name="About"
        component={AboutScreen}
        options={{ ...commonHeaderOptions, title: 'Sobre' }}
      />
      <SettingsStack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ ...commonHeaderOptions, title: 'Termos de Uso' }}
      />
      <SettingsStack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ ...commonHeaderOptions, title: 'Privacidade' }}
      />
    </SettingsStack.Navigator>
  );
}

function OnboardingFlow() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="MantraInfo" component={MantraInfoScreen} />
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
        tabBarStyle: styles.tabBar,
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
        options={({ route }) => ({
          tabBarLabel: 'Sessao',
          tabBarIcon: ({ focused }) => <TabIcon label="🧘" focused={focused} />,
          tabBarStyle:
            getFocusedRouteNameFromRoute(route) === 'Player'
              ? styles.tabBarHidden
              : styles.tabBar,
        })}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Historico',
          tabBarIcon: ({ focused }) => <TabIcon label="📅" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackScreen}
        options={{
          tabBarLabel: 'Config',
          tabBarIcon: ({ focused }) => <TabIcon label="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      {hasCompletedOnboarding ? <MainTabs /> : <OnboardingFlow />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    paddingTop: 4,
  },
  tabBarHidden: {
    display: 'none',
  },
  tabIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  tabIconFocused: {
    color: colors.primary,
  },
});
