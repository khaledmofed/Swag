// Export all stores
export * from './languageStore';
export * from './themeStore';
export * from './sidebarStore';
export * from './systemSettingsStore';
export * from './footerStore';
export * from './servicesStore';
export * from './categoriesStore';
export * from './blogStore';

// Export API utilities
export * from '../lib/api';

// Export types
export * from '../types/api';

// Store initialization hook

/**
 * Hook to initialize all API stores
 * Call this in your main layout or app component to ensure data is loaded
 */
// export const useInitializeStores = () => {
//   const initSystemSettings = useSystemSettingsStore((state) => state.fetchSystemSettings);
//   const initBannerSettings = useBannerStore((state) => state.fetchBannerSettings);
//   const initFooter = useFooterStore((state) => state.fetchFooter);
//   const initServices = useServicesStore((state) => state.fetchServices);
//   const initCategories = useCategoriesStore((state) => state.fetchCategories);
//   const initBlogs = useBlogStore((state) => state.fetchBlogs);

//   const initializeAll = async () => {
//     try {
//       // Initialize all stores in parallel
//       await Promise.allSettled([
//         initSystemSettings(),
//         initBannerSettings(),
//         initFooter(),
//         initServices(),
//         initCategories(),
//         initBlogs(),
//       ]);
//     } catch (error) {
//       console.error('Error initializing stores:', error);
//     }
//   };

//   return { initializeAll };
// };

/**
 * Hook to refresh all API data
 * Useful when language changes or when you need fresh data
 * Note: With React Query, this is handled automatically through cache invalidation
 */
export const useRefreshAllStores = () => {
  // With React Query, we can use queryClient.invalidateQueries() instead
  // This is now handled by the individual React Query hooks
  console.warn('useRefreshAllStores is deprecated. Use React Query invalidateQueries instead.');

  const refreshAll = async () => {
    console.warn('refreshAll is deprecated. Use React Query queryClient.invalidateQueries() instead.');
  };

  return { refreshAll };
};

/**
 * Hook to get loading states from all stores
 * Note: With React Query, loading states are handled per query
 */
export const useGlobalLoadingState = () => {
  // With React Query, loading states are handled individually per hook
  console.warn('useGlobalLoadingState is deprecated. Use individual React Query loading states instead.');

  return {
    isAnyLoading: false,
    isAllLoading: false,
    systemSettingsLoading: false,
    footerLoading: false,
    servicesLoading: false,
    categoriesLoading: false,
    blogLoading: false,
  };
};

/**
 * Hook to get error states from all stores
 * Note: With React Query, error states are handled per query
 */
export const useGlobalErrorState = () => {
  // With React Query, error states are handled individually per hook
  console.warn('useGlobalErrorState is deprecated. Use individual React Query error states instead.');

  return {
    hasErrors: false,
    errors: [],
    systemSettingsError: null,
    footerError: null,
    servicesError: null,
    categoriesError: null,
    blogError: null,
  };
};
