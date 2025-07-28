'use client'

import { useEffect } from 'react'
import { useCategories, useActiveCategories } from '@/hooks/api'
import { useCategoriesStoreRQ } from '@/stores/categoriesStoreRQ'

export const useCategoriesWithStore = () => {
  const { setCategories } = useCategoriesStoreRQ()
  
  const query = useCategories()
  
  // Update Zustand store when React Query data changes
  useEffect(() => {
    if (query.data) {
      setCategories(query.data)
    }
  }, [query.data, setCategories])
  
  return {
    ...query,
    // Expose store methods for backward compatibility
    getCategoryBySlug: useCategoriesStoreRQ(state => state.getCategoryBySlug),
    getActiveCategories: useCategoriesStoreRQ(state => state.getActiveCategories),
    getParentCategories: useCategoriesStoreRQ(state => state.getParentCategories),
    getCategoryChildren: useCategoriesStoreRQ(state => state.getCategoryChildren),
  }
}

export const useActiveCategoriesWithStore = () => {
  const { setCategories } = useCategoriesStoreRQ()
  
  const query = useActiveCategories()
  
  // Update Zustand store when React Query data changes
  useEffect(() => {
    if (query.data) {
      setCategories(query.data)
    }
  }, [query.data, setCategories])
  
  return {
    ...query,
    // Expose store methods for backward compatibility
    getCategoryBySlug: useCategoriesStoreRQ(state => state.getCategoryBySlug),
    getActiveCategories: useCategoriesStoreRQ(state => state.getActiveCategories),
    getParentCategories: useCategoriesStoreRQ(state => state.getParentCategories),
    getCategoryChildren: useCategoriesStoreRQ(state => state.getCategoryChildren),
  }
}
