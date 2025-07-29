import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { apiClient, apiEndpoints } from "@/lib/api";
import { Service } from "@/types/api";
import { useLanguageStore } from "@/stores/languageStore";

export const fetchServices = async (language: string = "en") => {
  const response = await apiRequest<{ data: { items: Service[] } }>(() =>
    apiClient.get(apiEndpoints.services, {
      headers: {
        Accept: "application/json",
        "Accept-Language": language,
      },
    })
  );
  return response.data.items || [];
};

export const useServices = (
  options?: Omit<UseQueryOptions<Service[], Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["services", language],
    queryFn: () => fetchServices(language),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

export const useActiveServices = (
  options?: Omit<UseQueryOptions<Service[], Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["services", "active", language],
    queryFn: async () => {
      const response = await apiRequest<{ data: { items: Service[] } }>(() =>
        apiClient.get(apiEndpoints.services, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      const services = response.data.items || [];
      return services.filter((service: Service) => service.is_active);
    },
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

export const useServiceBySlug = (
  slug: string,
  options?: Omit<
    UseQueryOptions<Service | undefined, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["service", slug, language],
    queryFn: async () => {
      const response = await apiRequest<{ data: { items: Service[] } }>(() =>
        apiClient.get(apiEndpoints.services, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      const services = response.data.items || [];
      return services.find((service: Service) => service.slug === slug);
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
    ...options,
  });
};
