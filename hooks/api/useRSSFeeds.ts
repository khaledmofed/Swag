import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiClient, getCurrentLanguage } from "@/lib/api";

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  image?: string | null;
}

const fetchRSSFeed = async (endpoint: string): Promise<NewsItem[]> => {
  const language = getCurrentLanguage();
  console.log(`Fetching RSS feed ${endpoint} with language:`, language);

  const response = await apiClient.get(endpoint, {
    headers: {
      Accept: "application/json",
      "Accept-Language": language,
    },
  });

  console.log(`RSS feed ${endpoint} response:`, response.data);
  return response.data;
};

export const useStockNews = (
  options?: Omit<UseQueryOptions<NewsItem[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["rss", "stock-news"],
    queryFn: () => fetchRSSFeed("/api/stock-news"),
    staleTime: 5 * 60 * 1000, // 5 minutes for news
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    ...options,
  });
};

export const useBreakingNews = (
  options?: Omit<UseQueryOptions<NewsItem[], Error>, "queryKey" | "queryFn">
) => {
  console.log("useBreakingNews hook called");
  return useQuery({
    queryKey: ["rss", "breaking-news"],
    queryFn: () => fetchRSSFeed("/api/breaking-news"),
    staleTime: 2 * 60 * 1000, // 2 minutes for breaking news
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    ...options,
  });
};

export const useCommoditiesNews = (
  options?: Omit<UseQueryOptions<NewsItem[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["rss", "commodities-news"],
    queryFn: () => fetchRSSFeed("/api/commodities-news"),
    staleTime: 5 * 60 * 1000, // 5 minutes for news
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    ...options,
  });
};

export const useCurrenciesNews = (
  options?: Omit<UseQueryOptions<NewsItem[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["rss", "currencies-news"],
    queryFn: () => fetchRSSFeed("/api/currencies-news"),
    staleTime: 5 * 60 * 1000, // 5 minutes for news
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    ...options,
  });
};

export const useEconomicCalendar = (
  options?: Omit<UseQueryOptions<any[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["rss", "economic-calendar"],
    queryFn: () => fetchRSSFeed("/api/calendar"),
    staleTime: 30 * 60 * 1000, // 30 minutes for calendar
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
    ...options,
  });
};
