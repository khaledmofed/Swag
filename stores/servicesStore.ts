import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, apiEndpoints, apiRequest } from '@/lib/api';
import { Service, ServicesResponse, ServicesState } from '@/types/api';

interface ServicesStore extends ServicesState {
  fetchServices: () => Promise<void>;
  refreshServices: () => Promise<void>;
  getServiceBySlug: (slug: string) => Service | undefined;
  getActiveServices: () => Service[];
  isLoading: () => boolean;
  hasError: () => boolean;
  clearError: () => void;
}

export const useServicesStore = create<ServicesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      services: [],
      loading: false,
      error: null,
      lastFetch: null,

      // Fetch services from API
      fetchServices: async () => {
        const state = get();

        // Avoid duplicate requests if already loading
        if (state.loading) return;

        // Check if we have recent data (cache for 10 minutes)
        // const now = Date.now();
        // const cacheTime = 10 * 60 * 1000; // 10 minutes
        // if (state.lastFetch && (now - state.lastFetch) < cacheTime && state.services.length > 0) {
        //   return;
        // }

        set({ loading: true, error: null });

        try {
          const response = await apiRequest<ServicesResponse>(() =>
            apiClient.get(apiEndpoints.services)
          );

          // Sort services by order
          const sortedServices = response?.data;

          set({
            services: sortedServices?.items,
            loading: false,
            error: null,
            // lastFetch: now,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch services';
          set({
            loading: false,
            error: errorMessage,
          });
          console.error('Error fetching services:', error);
        }
      },

      // Force refresh services (ignores cache)
      refreshServices: async () => {
        set({ lastFetch: null });
        await get().fetchServices();
      },

      // Get service by slug
      getServiceBySlug: (slug: string) => {
        return get().services.find(service => service.slug === slug);
      },

      // Get only active services
      getActiveServices: () => {
        return get().services.filter(service => service.is_active);
      },

      // Helper methods
      isLoading: () => get().loading,
      hasError: () => !!get().error,
      clearError: () => set({ error: null }),
    }),
    {
      name: 'services-storage',
      // Only persist the services data, not loading states
      partialize: (state) => ({
        services: state.services,
        // lastFetch: state.lastFetch,
      }),
      // Don't auto-fetch on rehydration - only fetch when explicitly called
      onRehydrateStorage: () => (state) => {
        // Just rehydrate the state, don't auto-fetch
        return state;
      },
    }
  )
);

// Selector hooks for common use cases
export const useActiveServices = () => {
  return useServicesStore((state) => state.getActiveServices());
};

export const useServicesLoading = () => {
  return useServicesStore((state) => state.loading);
};

export const useServicesError = () => {
  return useServicesStore((state) => state.error);
};

export const useServiceBySlug = (slug: string) => {
  return useServicesStore((state) => state.getServiceBySlug(slug));
};
