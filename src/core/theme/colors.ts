export const colors = {
  background: '#F8F7F4',
  surface: '#FFFFFF',
  primary: '#1B3A5C',
  primaryLight: '#2D5F8A',
  accent: '#C9A84C',
  accentLight: '#E8D5A0',

  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textInverse: '#FFFFFF',

  // Phase colors
  rampUp: '#5B8DB8',
  core: '#1B3A5C',
  cooldown: '#C9A84C',

  success: '#4CAF50',
  error: '#E53935',
  border: '#E5E7EB',
  disabled: '#D1D5DB',
} as const;

export type ColorKey = keyof typeof colors;
