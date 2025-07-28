import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { apiClient, apiEndpoints } from "@/lib/api";
import { FooterData } from "@/types/api";
import { useLanguageStore } from "@/stores/languageStore";

export const fetchFooter = async (language: string = "en") => {
  const response = await apiRequest<{ data: FooterData }>(() =>
    apiClient.get(apiEndpoints.footer, {
      headers: {
        Accept: "application/json",
        "Accept-Language": language,
      },
    })
  );
  return response.data;
};

export const useFooter = (
  options?: Omit<UseQueryOptions<FooterData, Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["footer", language],
    queryFn: () => fetchFooter(language),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};
