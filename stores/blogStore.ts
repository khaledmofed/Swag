import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient, apiEndpoints, apiRequest } from "@/lib/api";
import {
  Blog,
  BlogsResponse,
  BlogDetailResponse,
  BlogState,
  BlogsParams,
} from "@/types/api";

interface BlogStore extends BlogState {
  fetchBlogs: (params?: BlogsParams) => Promise<void>;
  fetchBlogBySlug: (slug: string) => Promise<void>;
  refreshBlogs: () => Promise<void>;
  loadMoreBlogs: () => Promise<void>;
  getBlogBySlug: (slug: string) => Blog | undefined;
  getFeaturedBlogs: () => Blog[];
  getBlogsByCategory: (categorySlug: string) => Blog[];
  isLoading: () => boolean;
  hasError: () => boolean;
  clearError: () => void;
  clearCurrentBlog: () => void;
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      // Initial state
      blogs: [],
      currentBlog: null,
      pagination: null,
      loading: false,
      error: null,
      lastFetch: null,

      // Fetch blogs from API
      fetchBlogs: async (params: BlogsParams = {}) => {
        const state = get();

        // Avoid duplicate requests if already loading
        if (state.loading) return;

        // Default parameters
        const defaultParams = {
          per_page: 10,
          page: 1,
          ...params,
        };

        // Check if we have recent data for the first page (cache for 5 minutes)
        // const now = Date.now();
        // const cacheTime = 5 * 60 * 1000; // 5 minutes
        const isFirstPage = defaultParams.page === 1;

        if (
          isFirstPage &&
          state.lastFetch &&
          // (now - state.lastFetch) < cacheTime &&
          state.blogs.length > 0 &&
          !params.category &&
          !params.search
        ) {
          return;
        }

        set({ loading: true, error: null });

        try {
          const queryParams = new URLSearchParams();
          Object.entries(defaultParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });

          const response = await apiRequest<BlogsResponse | any>(() =>
            apiClient.get(`${apiEndpoints.blogs}?${queryParams.toString()}`)
          );

          // If it's the first page, replace blogs; otherwise, append
          const newBlogs = isFirstPage
            ? response.data?.items
            : [...state.blogs, ...response.data?.items];

          set({
            blogs: newBlogs,
            pagination: {
              current_page: response.data?.current_page || 1,
              last_page: response.data?.last_page || 1,
              per_page: response.data?.per_page || 10,
              total: response.data?.total || 0,
            },
            loading: false,
            error: null,
            // lastFetch: isFirstPage ? now : state.lastFetch,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch blogs";
          set({
            loading: false,
            error: errorMessage,
          });
          console.error("Error fetching blogs:", error);
        }
      },

      // Fetch single blog by slug
      fetchBlogBySlug: async (slug: string) => {
        const state = get();

        // Check if we already have this blog
        const existingBlog = state.blogs.find((blog) => blog.slug === slug);
        if (existingBlog && state.currentBlog?.slug === slug) {
          return;
        }

        set({ loading: true, error: null });

        try {
          const response = await apiRequest<BlogDetailResponse>(() =>
            apiClient.get(apiEndpoints.blogDetail(slug))
          );

          set({
            currentBlog: response.data,
            loading: false,
            error: null,
          });

          // Also update the blog in the blogs array if it exists
          const blogIndex = state.blogs.findIndex((blog) => blog.slug === slug);
          if (blogIndex !== -1) {
            const updatedBlogs = [...state.blogs];
            updatedBlogs[blogIndex] = response.data;
            set({ blogs: updatedBlogs });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch blog details";
          set({
            loading: false,
            error: errorMessage,
          });
          console.error("Error fetching blog details:", error);
        }
      },

      // Force refresh blogs (ignores cache)
      refreshBlogs: async () => {
        set({ lastFetch: null, blogs: [], pagination: null });
        await get().fetchBlogs();
      },

      // Load more blogs (pagination)
      loadMoreBlogs: async () => {
        const state = get();
        if (
          !state.pagination ||
          state.pagination.current_page >= state.pagination.last_page
        ) {
          return;
        }

        await get().fetchBlogs({ page: state.pagination.current_page + 1 });
      },

      // Get blog by slug from current blogs
      getBlogBySlug: (slug: string) => {
        return get().blogs.find((blog) => blog.slug === slug);
      },

      // Get featured blogs
      getFeaturedBlogs: () => {
        return get().blogs.filter(
          (blog) => blog.is_featured && blog.is_published
        );
      },

      // Get blogs by category
      getBlogsByCategory: (categorySlug: string) => {
        return get().blogs.filter(
          (blog) => blog.category.slug === categorySlug && blog.is_published
        );
      },

      // Helper methods
      isLoading: () => get().loading,
      hasError: () => !!get().error,
      clearError: () => set({ error: null }),
      clearCurrentBlog: () => set({ currentBlog: null }),
    }),
    {
      name: "blog-storage",
      // Only persist the blog data, not loading states
      partialize: (state) => ({
        blogs: state.blogs,
        currentBlog: state.currentBlog,
        pagination: state.pagination,
        // lastFetch: state.lastFetch,
      }),
      // Rehydrate and fetch fresh data if needed
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check if we need to fetch fresh data after rehydration
          const now = Date.now();
          const cacheTime = 5 * 60 * 1000; // 5 minutes
          if (!state.lastFetch || now - state.lastFetch > cacheTime) {
            // Fetch fresh data in the background
            setTimeout(() => {
              state.fetchBlogs();
            }, 100);
          }
        }
      },
    }
  )
);

// Selector hooks for common use cases
export const useBlogList = () => {
  return useBlogStore((state) => state.blogs);
};

export const useCurrentBlog = () => {
  return useBlogStore((state) => state.currentBlog);
};

export const useFeaturedBlogs = () => {
  return useBlogStore((state) => state.getFeaturedBlogs());
};

export const useBlogLoading = () => {
  return useBlogStore((state) => state.loading);
};

export const useBlogError = () => {
  return useBlogStore((state) => state.error);
};

export const useBlogPagination = () => {
  return useBlogStore((state) => state.pagination);
};

export const useBlogBySlug = (slug: string) => {
  return useBlogStore((state) => state.getBlogBySlug(slug));
};
