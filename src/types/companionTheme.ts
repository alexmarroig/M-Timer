export type ThemeId = 'natureza' | 'oceano' | 'floresta' | 'montanha' | 'aurora';

export interface ThemeUnlock {
  type: 'free' | 'streak' | 'xp';
  value: number;
  description: string;
}

export interface ThemeColors {
  body: string;
  bodyLevel2: string;
  glow: string;
  glowLevel4: string;
  particle: string;
  rim: string;
  halo: string;
}

export interface CompanionTheme {
  id: ThemeId;
  name: string;
  emoji: string;
  unlock: ThemeUnlock;
  levelNames: [string, string, string, string, string];
  colors: ThemeColors;
}

export const COMPANION_THEMES: Record<ThemeId, CompanionTheme> = {
  natureza: {
    id: 'natureza',
    name: 'Natureza',
    emoji: '🌱',
    unlock: { type: 'free', value: 0, description: 'Sempre disponível' },
    levelNames: ['Semente', 'Broto', 'Flor', 'Luz', 'Transcendência'],
    colors: {
      body: '#FFF5E1',
      bodyLevel2: '#FFF9ED',
      glow: '#FFE4B5',
      glowLevel4: '#C9A84C',
      particle: '#FFFFFF',
      rim: '#C9A84C',
      halo: '#C9A84C',
    },
  },
  oceano: {
    id: 'oceano',
    name: 'Oceano',
    emoji: '🌊',
    unlock: { type: 'streak', value: 7, description: '7 dias seguidos' },
    levelNames: ['Gota', 'Onda', 'Corrente', 'Maré', 'Abismo'],
    colors: {
      body: '#E3F2FD',
      bodyLevel2: '#EBF5FD',
      glow: '#90CAF9',
      glowLevel4: '#0288D1',
      particle: '#B3E5FC',
      rim: '#0288D1',
      halo: '#0277BD',
    },
  },
  floresta: {
    id: 'floresta',
    name: 'Floresta',
    emoji: '🌿',
    unlock: { type: 'streak', value: 14, description: '14 dias seguidos' },
    levelNames: ['Semente', 'Broto', 'Folha', 'Copa', 'Raiz'],
    colors: {
      body: '#E8F5E9',
      bodyLevel2: '#F0FAF0',
      glow: '#A5D6A7',
      glowLevel4: '#2E7D32',
      particle: '#C8E6C9',
      rim: '#388E3C',
      halo: '#1B5E20',
    },
  },
  montanha: {
    id: 'montanha',
    name: 'Montanha',
    emoji: '⛰️',
    unlock: { type: 'streak', value: 30, description: '30 dias seguidos' },
    levelNames: ['Pedra', 'Trilha', 'Pico', 'Névoa', 'Cume'],
    colors: {
      body: '#ECEFF1',
      bodyLevel2: '#F5F7F8',
      glow: '#B0BEC5',
      glowLevel4: '#455A64',
      particle: '#CFD8DC',
      rim: '#546E7A',
      halo: '#263238',
    },
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    emoji: '🌅',
    unlock: { type: 'xp', value: 1000, description: 'Nível 5 (1000 XP)' },
    levelNames: ['Penumbra', 'Crepúsculo', 'Aurora', 'Solstício', 'Éter'],
    colors: {
      body: '#FCE4EC',
      bodyLevel2: '#FDF0F4',
      glow: '#F48FB1',
      glowLevel4: '#C2185B',
      particle: '#F8BBD0',
      rim: '#E91E63',
      halo: '#880E4F',
    },
  },
};

export function isThemeUnlocked(
  theme: CompanionTheme,
  currentStreak: number,
  currentXp: number
): boolean {
  if (theme.unlock.type === 'free') return true;
  if (theme.unlock.type === 'streak') return currentStreak >= theme.unlock.value;
  if (theme.unlock.type === 'xp') return currentXp >= theme.unlock.value;
  return false;
}
