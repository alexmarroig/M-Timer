import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LoginScreen } from '../../modules/auth/screens/LoginScreen';
import { HomeScreen } from '../../modules/session/screens/HomeScreen';
import { PlayerScreen } from '../../modules/session/screens/PlayerScreen';
import { HistoryScreen } from '../../modules/history/screens/HistoryScreen';
import { SettingsScreen } from '../../modules/settings/screens/SettingsScreen';
import { AboutScreen } from '../../modules/settings/screens/AboutScreen';
import { TermsScreen } from '../../modules/settings/screens/TermsScreen';
import { PrivacyScreen } from '../../modules/settings/screens/PrivacyScreen';
import { WelcomeScreen } from '../../modules/onboarding/screens/WelcomeScreen';
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
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 4,
          height: 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="SessionTab"
        component={SessionStackScreen}
        options={{
          tabBarLabel: 'Sessão',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'flower' : 'flower-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackScreen}
        options={{
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'options' : 'options-outline'} size={24} color={color} />
          ),
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

});
