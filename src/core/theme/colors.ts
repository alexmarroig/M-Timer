export const colors = {
  background: '#FCFAF7', // Warmer off-white
  surface: '#FFFFFF',
  primary: '#0F2B41',    // Deeper Midnight Navy
  primaryLight: '#235073',
  accent: '#A67C00',     // Deep Matte Gold
  accentLight: '#E8D5A0',

  textPrimary: '#0A121A',
  textSecondary: '#5E6772',
  textInverse: '#FFFFFF',

  // Phase colors
  rampUp: '#5B8DB8',     // Sea Blue
  core: '#0F2B41',       // Deep Focus
  cooldown: '#A67C00',   // Reflection Gold

  success: '#388E3C',
  error: '#D32F2F',
  border: '#EEEAE5',     // Soft Warm Border
  disabled: '#D1D5DB',
  glass: 'rgba(255, 255, 255, 0.7)',
} as const;

export type ColorKey = keyof typeof colors;
