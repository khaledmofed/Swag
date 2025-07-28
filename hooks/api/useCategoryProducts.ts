import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { useLanguageStore } from "@/stores/languageStore";

export interface CategoryProduct {
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

export interface CategoryProductsResponse {
  products: {
    current_page: number;
    data: CategoryProduct[];
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
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status?: number;
  is_active?: number;
  is_featured?: number;
  language?: string;
  created_at: string;
  updated_at: string;
}

const BASE_URL = "https://swag.ivadso.com";

export const fetchCategoryBySlug = async (
  slug: string,
  language: string = "en"
): Promise<Category> => {
  try {
    // First try the direct slug endpoint
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/categories/${slug}`,
        {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        }
      );
      // The response structure is { code: 200, message: string, data: Category }
      return response.data.data;
    } catch (error) {
      // If direct fails, get all categories and find by slug
      const response = await axios.get(`${BASE_URL}/api/v1/categories`, {
        headers: {
          Accept: "application/json",
          "Accept-Language": language,
        },
      });
      const categories = response.data.data?.items || response.data || [];
      const category = categories.find((cat: any) => cat.slug === slug);

      if (!category) {
        throw new Error(`Category with slug "${slug}" not found`);
      }

      return category;
    }
  } catch (error) {
    throw error;
  }
};

export const fetchProductsByCategory = async (
  categoryId: number,
  page: number = 1,
  language: string = "en"
): Promise<CategoryProductsResponse> => {
  const response = await axios.get(
    `${BASE_URL}/api/store/products-by-cat/${categoryId}?page=${page}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": language,
      },
    }
  );
  // The response structure is { code: 200, message: string, data: CategoryProductsResponse }
  return response.data.data;
};

export const useCategoryBySlug = (
  slug: string,
  options?: Omit<UseQueryOptions<Category, Error>, "queryKey" | "queryFn">
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["category", slug, language],
    queryFn: () => fetchCategoryBySlug(slug, language),
    enabled: !!slug,
    ...options,
  });
};

export const useProductsByCategory = (
  categoryId: number,
  page: number = 1,
  options?: Omit<
    UseQueryOptions<CategoryProductsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["products", "category", categoryId, page, language],
    queryFn: () => fetchProductsByCategory(categoryId, page, language),
    enabled: !!categoryId && categoryId > 0,
    ...options,
  });
};
