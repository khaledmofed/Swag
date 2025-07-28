'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  mounted: boolean;
  systemPreference: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  initializeTheme: () => void;
  getSystemPreference: () => ThemeMode;
}

// Splash Screen State
interface SplashState {
  isVisible: boolean;
  isAnimating: boolean;
  mounted: boolean;
  hideSplash: () => void;
  showSplash: () => void;
  setAnimating: (animating: boolean) => void;
  initialize: () => void;
}

export const useThemeStore = create<ThemeState>()(
  subscribeWithSelector((set, get) => ({
    mode: 'light',
    mounted: false,
    systemPreference: 'light',

    getSystemPreference: (): ThemeMode => {
      if (typeof window === 'undefined') return 'light';
      return 'light';
    },

    toggleTheme: () => {
      const currentMode = get().mode;
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      set({ mode: newMode });

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newMode);
      }
    },

    setMode: (mode: ThemeMode) => {
      set({ mode });
      // Save to localStorage when mode is set
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', mode);
      }
    },

    initializeTheme: () => {
      if (typeof window === 'undefined') return;

      const systemPreference = get().getSystemPreference();
      const savedMode = localStorage.getItem('theme');
      let initialMode: ThemeMode = systemPreference;

      if (savedMode === 'light' || savedMode === 'dark') {
        initialMode = savedMode;
      } else {
        // Use system preference and save it
        localStorage.setItem('theme', systemPreference);
      }

      set({
        mode: initialMode,
        systemPreference,
        mounted: true
      });
    },
  }))
);

// Subscribe to mode changes and update document class
if (typeof window !== 'undefined') {
  useThemeStore.subscribe(
    (state) => state.mode,
    (mode) => {
      if (useThemeStore.getState().mounted) {
        if (mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  );

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    const newSystemPreference: ThemeMode = e.matches ? 'dark' : 'light';
    useThemeStore.setState({ systemPreference: newSystemPreference });
  };

  mediaQuery.addEventListener('change', handleSystemThemeChange);
}

// Splash Screen Store
export const useSplashStore = create<SplashState>((set, get) => ({
  isVisible: false, // Start as false for SSR
  isAnimating: false,
  mounted: false,

  initialize: () => {
    if (typeof window !== 'undefined') {
      set({ isVisible: true, mounted: true });
    }
  },

  hideSplash: () => {
    set({ isAnimating: true });
    // Hide splash after animation completes
    setTimeout(() => {
      set({ isVisible: false, isAnimating: false });
    }, 1000); // 1 second animation duration
  },

  showSplash: () => {
    if (get().mounted) {
      set({ isVisible: true, isAnimating: false });
    }
  },

  setAnimating: (animating: boolean) => {
    set({ isAnimating: animating });
  },
}));

// Convenience hook that matches the old API
export const useTheme = () => {
  const { mode, toggleTheme } = useThemeStore();
  return { mode, toggleTheme };
};

// Advanced hook with additional utilities
export const useThemeAdvanced = () => {
  const store = useThemeStore();

  return {
    ...store,
    isDark: store.mode === 'dark',
    isLight: store.mode === 'light',
    isSystemDark: store.systemPreference === 'dark',
    isSystemLight: store.systemPreference === 'light',
    matchesSystem: store.mode === store.systemPreference,
  };
};
