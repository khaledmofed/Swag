import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { apiClient, apiEndpoints } from "@/lib/api";
import { getCurrentLanguage } from "@/lib/api";

// Types for the store home API response
export interface StoreHomeProduct {
  id: number;
  category_id: number;
  slug: string;
  image: string;
  short_description_en: string;
  old_price: string;
  price: string;
  currency: string;
  reviews_count: number;
  rating: string;
  status: number;
  created_at: string;
  updated_at: string;
  featured: number;
  collection: number;
  karat: string | null;
  gender: string | null;
  metal: string | null;
  name: string;
  short_description: string;
  description: string;
}

export interface StoreHomeCategory {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  slug: string;
  description: {
    en: string;
    ar: string;
  };
  image: string;
  is_featured: number;
  is_active: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface StoreHomeCollection extends StoreHomeCategory {
  products: StoreHomeProduct[];
}

export interface StoreHomeAllProducts {
  current_page: number;
  data: StoreHomeProduct[];
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
}

export interface StoreHomeResponse {
  status: boolean;
  errNum: string;
  msg: string;
  data: {
    featuredProducts: StoreHomeProduct[];
    categories: StoreHomeCategory[];
    collections: {
      [key: string]: StoreHomeCollection;
    };
    all_products: StoreHomeAllProducts;
  };
}

export const fetchStoreHome = async (page: number = 1) => {
  const language = getCurrentLanguage();
  console.log("Fetching store home with:", { page, language });

  const response = await apiRequest<StoreHomeResponse>(() =>
    apiClient.get(`${apiEndpoints.storeHome}?page=${page}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": language,
      },
    })
  );

  console.log("Store home response:", response);
  return response;
};

export const useStoreHome = (page: number = 1) => {
  return useQuery({
    queryKey: ["storeHome", page],
    queryFn: () => fetchStoreHome(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 