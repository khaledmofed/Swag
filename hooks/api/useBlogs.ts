import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { apiClient, apiEndpoints, apiRequest } from "@/lib/api";
import {
  Blog,
  BlogsResponse,
  BlogDetailResponse,
  BlogsParams,
  BlogPopular,
} from "@/types/api";
import { useLanguageStore } from "@/stores/languageStore";

export const fetchBlogs = async (
  perPage: number = 6,
  language: string = "en"
) => {
  const response = await apiRequest<BlogsResponse>(() =>
    apiClient.get(`${apiEndpoints.blogs}?per_page=${perPage}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": language,
      },
    })
  );
  return response;
};

export const useBlogs = (
  perPage: number = 6,
  options?: Omit<UseQueryOptions<BlogsResponse, Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["blogs", perPage, language],
    queryFn: () => fetchBlogs(perPage, language),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

export const useBlogsPaginated = (
  params: BlogsParams = {},
  options?: Omit<
    UseInfiniteQueryOptions<BlogsResponse, Error>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >
) => {
  const { language } = useLanguageStore();

  return useInfiniteQuery({
    queryKey: ["blogs", "paginated", params, language],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams();
      Object.entries({ ...params, page: pageParam }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiRequest<BlogsResponse>(() =>
        apiClient.get(`${apiEndpoints.blogs}?${queryParams.toString()}`, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data?.current_page < lastPage.data?.last_page) {
        return lastPage.data.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useBlogBySlug = (
  slug: string,
  options?: Omit<UseQueryOptions<Blog, Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["blog", slug, language],
    queryFn: async () => {
      const response = await apiRequest<BlogDetailResponse>(() =>
        apiClient.get(apiEndpoints.blogDetail(slug), {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
    ...options,
  });
};

export const useBlogByPopular = (
  limit: number,
  options?: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["blogPopular", limit, language],
    queryFn: async () => {
      const response = await apiRequest<any>(() =>
        apiClient.get(`${apiEndpoints.blogPopular}?limit=${limit}`, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};
