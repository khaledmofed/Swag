import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  apiClient,
  apiEndpoints,
  apiRequest,
  getCurrentLanguage,
} from "@/lib/api";
import {
  LiveMarketData,
  LiveMarketInsightsResponse,
  MarketPrice,
  MarketNews,
  MarketIndicator,
} from "@/types/api";

export const useLiveMarketInsights = (
  options?: Omit<UseQueryOptions<LiveMarketData, Error>, "queryKey" | "queryFn">
) => {
  console.log("useLiveMarketInsights hook called");
  return useQuery({
    queryKey: ["liveMarketInsights"],
    queryFn: async () => {
      const language = getCurrentLanguage();
      console.log("Fetching live market insights with language:", language);

      const response = await apiRequest<LiveMarketInsightsResponse>(() =>
        apiClient.get(apiEndpoints.liveMarketInsights, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        })
      );
      console.log("LiveMarketInsights response:", response);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute for live market data
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
    ...options,
  });
};

export const useMarketPrices = (
  options?: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["marketPrices"],
    queryFn: async () => {
      const response = await apiRequest<any>(() =>
        apiClient.get(apiEndpoints.liveMarketInsights)
      );
      return response.data.market_overview.link;
    },
    ...options,
  });
};

export const useMarketNews = (
  options?: Omit<UseQueryOptions<MarketNews[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["marketNews"],
    queryFn: async () => {
      const response = await apiRequest<any>(() =>
        apiClient.get(apiEndpoints.liveMarketInsights)
      );
      return response.data.news || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for market news
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    ...options,
  });
};

export const useMarketIndicators = (
  options?: Omit<
    UseQueryOptions<MarketIndicator[], Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["marketIndicators"],
    queryFn: async () => {
      const response = await apiRequest<LiveMarketInsightsResponse>(() =>
        apiClient.get(apiEndpoints.liveMarketInsights)
      );
      return response.data.indicators || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for market indicators
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    ...options,
  });
};

export const usePriceBySymbol = (
  symbol: string,
  options?: Omit<
    UseQueryOptions<MarketPrice | undefined, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["marketPrice", symbol],
    queryFn: async () => {
      const response = await apiRequest<LiveMarketInsightsResponse>(() =>
        apiClient.get(apiEndpoints.liveMarketInsights)
      );
      const prices = response.data.prices || [];
      return prices.find((price) => price.symbol === symbol);
    },
    staleTime: 1 * 60 * 1000, // 1 minute for live market data
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
    enabled: !!symbol,
    ...options,
  });
};
