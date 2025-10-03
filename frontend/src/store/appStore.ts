import { create } from 'zustand';

interface AppStoreState {
  theme: 'light' | 'dark';
  setTheme: (theme: AppStoreState['theme']) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
