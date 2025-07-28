import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FooterData } from '@/types/api';

interface FooterStore {
  footer: FooterData | null;
  setFooter: (footer: FooterData | null) => void;
}

export const useFooterStore = create<FooterStore>()(
  persist(
    (set, get) => ({
      // Initial state
      footer: null,

      // Set footer data from React Query
      setFooter: (footer: FooterData | null) => {
        set({ footer });
      },
    }),
    {
      name: 'footer-storage',
      // Only persist the footer data
      partialize: (state) => ({
        footer: state.footer,
      }),
    }
  )
);

// Selector hooks for common use cases
export const useFooterData = () => {
  return useFooterStore((state) => state.footer);
};

export const useFooterSections = () => {
  return useFooterStore((state) => state.footer?.sections || []);
};

export const useFooterSocialLinks = () => {
  return useFooterStore((state) => state.footer?.social_links || {});
};
