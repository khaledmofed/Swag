import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { apiClient, apiEndpoints } from "@/lib/api";
import { Category } from "@/types/api";
import { useLanguageStore } from "@/stores/languageStore";

export const fetchCategories = async (language: string = "en") => {
  console.log("Fetching categories with language:", language);
  const response = await apiRequest<{ data: Category[] }>(() =>
    apiClient.get(apiEndpoints.categories, {
      headers: {
        Accept: "application/json",
        "Accept-Language": language,
      },
    })
  );
  console.log("Categories response:", response);
  return response.data;
};

export const useCategories = (
  options?: Omit<UseQueryOptions<Category[], Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();
  console.log("useCategories hook - current language:", language);

  return useQuery({
    queryKey: ["categories", language],
    queryFn: () => fetchCategories(language),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

export const useActiveCategories = (
  options?: Omit<UseQueryOptions<Category[], Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["categories", "active", language],
    queryFn: async () => {
      const response = await apiRequest<{ data: Category[] }>(() =>
        apiClient.get(apiEndpoints.categories, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      const categories = response.data || [];
      return categories.filter((category: Category) => category.is_active);
    },
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

export const useParentCategories = (
  options?: Omit<UseQueryOptions<Category[], Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["categories", "parents", language],
    queryFn: async () => {
      const response = await apiRequest<{ data: Category[] }>(() =>
        apiClient.get(apiEndpoints.categories, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      const categories = response.data || [];
      return categories.filter((category: Category) => !category.parent_id);
    },
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

export const useCategoryBySlug = (
  slug: string,
  options?: Omit<
    UseQueryOptions<Category | undefined, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["category", slug, language],
    queryFn: async () => {
      const response = await apiRequest<{ data: Category[] }>(() =>
        apiClient.get(apiEndpoints.categories, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      const categories = response.data || [];
      return categories.find((category: Category) => category.slug === slug);
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!slug,
    ...options,
  });
};

export const useCategoryChildren = (
  parentId: number,
  options?: Omit<UseQueryOptions<Category[], Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["categories", "children", parentId, language],
    queryFn: async () => {
      const response = await apiRequest<{ data: Category[] }>(() =>
        apiClient.get(apiEndpoints.categories, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      const categories = response.data || [];
      return categories.filter(
        (category: Category) => category.parent_id === parentId
      );
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!parentId,
    ...options,
  });
};

export const useCategoryById = (
  categoryId: number,
  options?: Omit<
    UseQueryOptions<Category | undefined, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["category", "byId", categoryId, language],
    queryFn: async () => {
      const response = await apiRequest<{ data: { items: Category[] } }>(() =>
        apiClient.get(apiEndpoints.categories, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      const categories = response.data || { items: [] };
      console.log("categories:", categories);

      return categories?.items?.find(
        (category: Category) => category.id === categoryId
      );
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!categoryId,
    ...options,
  });
};

export const fetchCategoriesPaginated = async (
  page: number = 1,
  language: string = "en"
) => {
  console.log("Fetching categories paginated with language:", language);
  const response = await apiRequest<{
    data: {
      items: Category[];
      pagination: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        path: string;
        from: number;
        to: number;
      };
    };
  }>(() =>
    apiClient.get(apiEndpoints.categories, {
      params: { page },
      headers: {
        Accept: "application/json",
        "Accept-Language": language,
      },
    })
  );
  console.log("Categories paginated response:", response);
  return response.data;
};

export const useCategoriesPaginated = (
  page: number = 1,
  options?: Omit<
    UseQueryOptions<
      {
        items: Category[];
        pagination: {
          current_page: number;
          last_page: number;
          total: number;
          per_page: number;
          path: string;
          from: number;
          to: number;
        };
      },
      Error
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { language } = useLanguageStore();
  console.log("useCategoriesPaginated hook - current language:", language);

  return useQuery({
    queryKey: ["categories", "paginated", page, language],
    queryFn: () => fetchCategoriesPaginated(page, language),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};
