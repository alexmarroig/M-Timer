import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'uuid';
import { SessionTemplate } from '../types/session';
import { STORAGE_KEYS } from '../services/storage/keys';

interface SessionStore {
  templates: SessionTemplate[];
  addTemplate: (name: string, phases: SessionTemplate['phases']) => void;
  updateTemplate: (id: string, updates: Partial<Pick<SessionTemplate, 'name' | 'phases'>>) => void;
  deleteTemplate: (id: string) => void;
  setDefault: (id: string) => void;
  getDefault: () => SessionTemplate | undefined;
}

const BUILT_IN_TEMPLATES: SessionTemplate[] = [
  {
    id: 'preset-morning',
    name: 'Manhã Padrão',
    phases: { rampUp: 120, core: 1200, cooldown: 180 },
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'preset-afternoon',
    name: 'Tarde Padrão',
    phases: { rampUp: 60, core: 900, cooldown: 120 },
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'preset-travel',
    name: 'Viagem',
    phases: { rampUp: 60, core: 600, cooldown: 120 },
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      templates: BUILT_IN_TEMPLATES,

      addTemplate: (name, phases) => {
        const template: SessionTemplate = {
          id: uuid(),
          name,
          phases,
          isDefault: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ templates: [...state.templates, template] }));
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id ? { ...template, ...updates } : template
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },

      setDefault: (id) => {
        set((state) => ({
          templates: state.templates.map((template) => ({
            ...template,
            isDefault: template.id === id,
          })),
        }));
      },

      getDefault: () => {
        const { templates } = get();
        return templates.find((template) => template.isDefault) || templates[0];
      },
    }),
    {
      name: STORAGE_KEYS.SESSION_TEMPLATES,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
