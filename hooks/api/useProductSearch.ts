import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { useLanguageStore } from "@/stores/languageStore";

const BASE_URL = "https://swag.ivadso.com";

export interface ProductSearchParams {
  category?: number;
  karat?: string;
  gender?: string;
  metal?: string;
  price_from?: string;
  price_to?: string;
  name?: string;
  order?: string;
  orderby?: string;
  page?: number;
  occasion?: string;
  weight?: string;
}

export interface ProductSearchResponse {
  status: boolean;
  errNum: string;
  msg: string;
  data: {
    products: {
      current_page: number;
      data: any[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  };
}

export const fetchProductSearch = async (
  params: ProductSearchParams,
  language: string = "en"
): Promise<ProductSearchResponse> => {
  try {
    const searchParams = new URLSearchParams();

    // Add all parameters to the search
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const response = await axios.get(
      `${BASE_URL}/api/store/search?${searchParams.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    );

    return response.data as ProductSearchResponse;
  } catch (error) {
    console.error("Error fetching product search:", error);
    throw error;
  }
};

export const useProductSearch = (
  params: ProductSearchParams,
  options?: Omit<
    UseQueryOptions<ProductSearchResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["product-search", params, language],
    queryFn: () => fetchProductSearch(params, language),
    enabled: true, // Always enabled for search page
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
