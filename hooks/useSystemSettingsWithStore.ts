"use client";

import { useEffect } from "react";
import { useSystemSettings, UseSystemSettingsOptions } from "@/hooks/api";
import { useSystemSettingsStore } from "@/stores/systemSettingsStore";

export const useSystemSettingsWithStore = (
  options: UseSystemSettingsOptions = {}
) => {
  const { setSettings } = useSystemSettingsStore();

  const query = useSystemSettings({
    ...options,
    enabled: options.enabled !== false && typeof window !== "undefined",
  });

  // Update Zustand store when React Query data changes
  useEffect(() => {
    if (query.data) {
      setSettings(query.data);
    }
  }, [query.data, setSettings]);

  return {
    ...query,
    // Expose store methods for backward compatibility
    getSettingByKey: useSystemSettingsStore((state) => state.getSettingByKey),
    getSettingValue: useSystemSettingsStore((state) => state.getSettingValue),
    getSettingsByKeyPattern: useSystemSettingsStore(
      (state) => state.getSettingsByKeyPattern
    ),
    getBannerSettings: useSystemSettingsStore(
      (state) => state.getBannerSettings
    ),
    getMenuSettings: useSystemSettingsStore((state) => state.getMenuSettings),
  };
};
