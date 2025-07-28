import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  apiClient,
  apiEndpoints,
  apiRequest,
  getCurrentLanguage,
} from "@/lib/api";
import { Category, CategoriesResponse, CategoriesState } from "@/types/api";

interface CategoriesStore extends CategoriesState {
  fetchCategories: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getActiveCategories: () => Category[];
  getParentCategories: () => Category[];
  getCategoryChildren: (parentId: number) => Category[];
  isLoading: () => boolean;
  hasError: () => boolean;
  clearError: () => void;
}

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: [],
      loading: false,
      error: null,
      lastFetch: null,

      // Fetch categories from API
      fetchCategories: async () => {
        const state = get();

        // Avoid duplicate requests if already loading
        if (state.loading) return;

        // Check if we have recent data (cache for 15 minutes)
        // const now = Date.now();
        // const cacheTime = 15 * 60 * 1000; // 15 minutes
        // if (state.lastFetch && (now - state.lastFetch) < cacheTime && state.categories.length > 0) {
        //   return;
        // }

        set({ loading: true, error: null });

        try {
          const language = getCurrentLanguage();
          console.log("CategoriesStore - fetching with language:", language);

          const response = await apiRequest<CategoriesResponse>(() =>
            apiClient.get(apiEndpoints.categories, {
              headers: {
                Accept: "application/json",
                "Accept-Language": language,
              },
            })
          );

          console.log("CategoriesStore - response:", response);

          // Sort categories by order
          const sortedCategories = (response.data.items ?? [])?.sort(
            (a, b) => a.order - b.order
          );

          set({
            categories: sortedCategories,
            loading: false,
            error: null,
            // lastFetch: now,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch categories";
          set({
            loading: false,
            error: errorMessage,
          });
          console.error("Error fetching categories:", error);
        }
      },

      // Force refresh categories (ignores cache)
      refreshCategories: async () => {
        set({ lastFetch: null });
        await get().fetchCategories();
      },

      // Get category by slug
      getCategoryBySlug: (slug: string) => {
        return get().categories.find((category) => category.slug === slug);
      },

      // Get only active categories
      getActiveCategories: () => {
        return get().categories.filter((category) => category.is_active);
      },

      // Get parent categories (categories without parent_id)
      getParentCategories: () => {
        return get().categories.filter(
          (category) => category.is_active && !category.parent_id
        );
      },

      // Get children of a specific category
      getCategoryChildren: (parentId: number) => {
        return get().categories.filter(
          (category) => category.is_active && category.parent_id === parentId
        );
      },

      // Helper methods
      isLoading: () => get().loading,
      hasError: () => !!get().error,
      clearError: () => set({ error: null }),
    }),
    {
      name: "categories-storage",
      // Only persist the categories data, not loading states
      partialize: (state) => ({
        categories: state.categories,
        // lastFetch: state.lastFetch,
      }),
      // Rehydrate and fetch fresh data if needed
      // onRehydrateStorage: () => (state) => {
      //   if (state) {
      //     // Check if we need to fetch fresh data after rehydration
      //     const now = Date.now();
      //     const cacheTime = 15 * 60 * 1000; // 15 minutes
      //     if (!state.lastFetch || (now - state.lastFetch) > cacheTime) {
      //       // Fetch fresh data in the background
      //       setTimeout(() => {
      //         state.fetchCategories();
      //       }, 100);
      //     }
      //   }
      // },
    }
  )
);

// Selector hooks for common use cases
export const useActiveCategories = () => {
  return useCategoriesStore((state) => state.getActiveCategories());
};

export const useParentCategories = () => {
  return useCategoriesStore((state) => state.getParentCategories());
};

export const useCategoriesLoading = () => {
  return useCategoriesStore((state) => state.loading);
};

export const useCategoriesError = () => {
  return useCategoriesStore((state) => state.error);
};

export const useCategoryBySlug = (slug: string) => {
  return useCategoriesStore((state) => state.getCategoryBySlug(slug));
};

export const useCategoryChildren = (parentId: number) => {
  return useCategoriesStore((state) => state.getCategoryChildren(parentId));
};
