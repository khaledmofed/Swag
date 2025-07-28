import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Service } from '@/types/api';

interface ServicesStore {
  services: Service[];
  setServices: (services: Service[]) => void;
  getServiceBySlug: (slug: string) => Service | undefined;
  getActiveServices: () => Service[];
}

export const useServicesStoreRQ = create<ServicesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      services: [],

      // Set services data from React Query
      setServices: (services: Service[]) => {
        set({ services });
      },

      // Get service by slug
      getServiceBySlug: (slug: string) => {
        return get().services.find(service => service.slug === slug);
      },

      // Get only active services
      getActiveServices: () => {
        return get().services.filter(service => service.is_active);
      },
    }),
    {
      name: 'services-storage-rq',
      // Only persist the services data
      partialize: (state) => ({
        services: state.services,
      }),
    }
  )
);

// Selector hooks for common use cases
export const useActiveServicesRQ = () => {
  return useServicesStoreRQ((state) => state.getActiveServices());
};

export const useServiceBySlugRQ = (slug: string) => {
  return useServicesStoreRQ((state) => state.getServiceBySlug(slug));
};
