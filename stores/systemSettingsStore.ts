import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SystemSetting, SystemSettingsState } from '@/types/api';

interface SystemSettingsStore {
  // Data from React Query will be passed in
  settings: SystemSetting[];
  setSettings: (settings: SystemSetting[]) => void;

  // Helper methods for accessing settings
  getSettingByKey: (key: string) => SystemSetting | undefined | any;
  getSettingValue: (key: string) => string | undefined | any;
  getSettingsByKeyPattern: (pattern: string) => SystemSetting[];
  getBannerSettings: () => SystemSetting[];
  getMenuSettings: () => SystemSetting[];
}

export const useSystemSettingsStore = create<SystemSettingsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: [],

      // Set settings from React Query
      setSettings: (settings: SystemSetting[]) => {
        set({ settings });
      },

      // Get setting by key
      getSettingByKey: (key: string) => {
        return get().settings.find(setting => setting.key === key);
      },

      // Get setting value by key
      getSettingValue: (key: string) => {
        const setting = get().getSettingByKey(key);
        return setting?.value;
      },

      // Get settings by key pattern (e.g., "HERO_BANNER_", "PROMOTION_")
      getSettingsByKeyPattern: (pattern: string) => {
        return get().settings.filter(setting => setting.key.startsWith(pattern));
      },

      // Get all banner-related settings
      getBannerSettings: () => {
        const bannerPatterns = ['HERO_BANNER_', 'PROMOTION_BANNER_', 'SHOP_NOW_'];
        return get().settings.filter(setting =>
          bannerPatterns.some(pattern => setting.key.startsWith(pattern))
        );
      },

      // Get menu-related settings
      getMenuSettings: () => {
        return get().settings.filter(setting => setting.key.startsWith('HEAD_SECTION_MENU_'));
      },

    }),
    {
      name: 'system-settings-storage',
      // Only persist the settings data
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);

// Selector hooks for common use cases
export const useSystemSetting = (key: string) => {
  return useSystemSettingsStore((state) => state.getSettingValue(key));
};
