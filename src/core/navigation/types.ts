import { SessionTemplate } from '../../types/session';
import { ExperienceLevel } from '../../types/user';

export type SessionStackParamList = {
  Home: undefined;
  Player: { template: SessionTemplate };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  About: undefined;
  Terms: undefined;
  Privacy: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  MantraInfo: undefined;
  Experience: undefined;
  Schedule: { experience: ExperienceLevel };
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPasswordSent: { email: string };
};

export type TabParamList = {
  SessionTab: undefined;
  HistoryTab: undefined;
  SettingsTab: undefined;
};
