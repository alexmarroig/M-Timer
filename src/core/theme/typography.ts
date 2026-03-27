import { Platform } from 'react-native';

const monoFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const typography = {
  heading: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  timer: {
    fontSize: 48,
    fontWeight: '300' as const,
    fontFamily: monoFont,
    lineHeight: 56,
  },
  timerSmall: {
    fontSize: 24,
    fontWeight: '300' as const,
    fontFamily: monoFont,
    lineHeight: 32,
  },
} as const;
