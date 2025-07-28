import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { useLanguageStore } from "@/stores/languageStore";

const BASE_URL = "https://swag.ivadso.com";

export interface Product {
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
  karat: string | null;
  gender: string | null;
  metal: string | null;
  name: string;
  short_description: string;
  description: string;
}

export interface ProductResponse {
  status: boolean;
  errNum: string;
  msg: string;
  data: {
    product: Product;
    related: {
      current_page: number;
      data: Product[];
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

export const fetchProductDetails = async (
  id: string,
  language: string = "en"
) => {
  try {
    console.log("Fetching product with ID:", id);
    const res = await axios.get(`${BASE_URL}/api/store/product/${id}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
    console.log("API Response:", res.data);
    return res.data as ProductResponse;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const useProductDetails = (
  id: string,
  options?: Omit<
    UseQueryOptions<ProductResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["product", id, language],
    queryFn: () => fetchProductDetails(id, language),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
