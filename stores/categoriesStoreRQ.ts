import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '@/types/api';

interface CategoriesStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getActiveCategories: () => Category[];
  getParentCategories: () => Category[];
  getCategoryChildren: (parentId: number) => Category[];
}

export const useCategoriesStoreRQ = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: [],

      // Set categories data from React Query
      setCategories: (categories: Category[]) => {
        set({ categories });
      },

      // Get category by slug
      getCategoryBySlug: (slug: string) => {
        return get().categories.find(category => category.slug === slug);
      },

      // Get only active categories
      getActiveCategories: () => {
        return get().categories.filter(category => category.is_active);
      },

      // Get parent categories (no parent_id)
      getParentCategories: () => {
        return get().categories.filter(category => !category.parent_id);
      },

      // Get children of a specific category
      getCategoryChildren: (parentId: number) => {
        return get().categories.filter(category => category.parent_id === parentId);
      },
    }),
    {
      name: 'categories-storage-rq',
      // Only persist the categories data
      partialize: (state) => ({
        categories: state.categories,
      }),
    }
  )
);

// Selector hooks for common use cases
export const useActiveCategoriesRQ = () => {
  return useCategoriesStoreRQ((state) => state.getActiveCategories());
};

export const useParentCategoriesRQ = () => {
  return useCategoriesStoreRQ((state) => state.getParentCategories());
};

export const useCategoryBySlugRQ = (slug: string) => {
  return useCategoriesStoreRQ((state) => state.getCategoryBySlug(slug));
};

export const useCategoryChildrenRQ = (parentId: number) => {
  return useCategoriesStoreRQ((state) => state.getCategoryChildren(parentId));
};
