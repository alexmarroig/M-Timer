import { SessionTemplate } from '../../types/session';

export type SessionStackParamList = {
  Home: undefined;
  Player: { template: SessionTemplate };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  About: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Experience: undefined;
  Schedule: { experience: string };
};

export type TabParamList = {
  SessionTab: undefined;
  HistoryTab: undefined;
  SettingsTab: undefined;
};
