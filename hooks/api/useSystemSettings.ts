import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { apiClient, apiEndpoints } from "@/lib/api";
import { SystemSetting } from "@/types/api";
import { useLanguageStore } from "@/stores/languageStore";

// Type for useSystemSettings options
export type UseSystemSettingsOptions = Omit<
  UseQueryOptions<SystemSetting[], Error>,
  "queryKey" | "queryFn"
> & {
  visibleOnly?: boolean;
};

export const fetchSystemSettings = async (
  visibleOnly: boolean = true,
  language: string = "en"
) => {
  console.log("Fetching system settings with:", { visibleOnly, language });

  const response = await apiRequest<{ data: SystemSetting[] }>(() =>
    apiClient.get(
      `${apiEndpoints.systemSettings}?visible_only=${visibleOnly ? 1 : 0}`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    )
  );

  console.log("System settings response:", response);
  return response.data;
};

export const useSystemSettings = (options: UseSystemSettingsOptions = {}) => {
  const { language } = useLanguageStore();
  const { visibleOnly = true, ...queryOptions } = options;

  console.log("useSystemSettings hook called with options:", {
    visibleOnly,
    language,
    ...queryOptions,
  });

  return useQuery({
    queryKey: ["systemSettings", visibleOnly, language],
    queryFn: () => fetchSystemSettings(visibleOnly, language),
    staleTime: 15 * 60 * 1000,
    ...queryOptions,
  });
};

export const useSystemSettingByKey = (
  key: string,
  options?: Omit<
    UseQueryOptions<any | undefined, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["systemSetting", key, language],
    queryFn: async () => {
      const response = await apiRequest<{ data: any[] }>(() =>
        apiClient.get(`${apiEndpoints.systemSettings}?key_filter=${key}`, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      return response.data.find((setting: any) => setting.key === key);
    },
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};
