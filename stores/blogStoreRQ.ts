import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Blog, BlogsResponse } from '@/types/api';

interface BlogStore {
  blogs: Blog[];
  currentBlog: Blog | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  setBlogs: (blogs: Blog[]) => void;
  setCurrentBlog: (blog: Blog | null) => void;
  setPagination: (pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null) => void;
  getBlogBySlug: (slug: string) => Blog | undefined;
  getFeaturedBlogs: () => Blog[];
  getBlogsByCategory: (categorySlug: string) => Blog[];
  clearCurrentBlog: () => void;
}

export const useBlogStoreRQ = create<BlogStore>()(
  persist(
    (set, get) => ({
      // Initial state
      blogs: [],
      currentBlog: null,
      pagination: null,

      // Set blogs data from React Query
      setBlogs: (blogs: Blog[]) => {
        set({ blogs });
      },

      // Set current blog
      setCurrentBlog: (blog: Blog | null) => {
        set({ currentBlog: blog });
      },

      // Set pagination
      setPagination: (pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      } | null) => {
        set({ pagination });
      },

      // Get blog by slug
      getBlogBySlug: (slug: string) => {
        return get().blogs.find(blog => blog.slug === slug);
      },

      // Get featured blogs
      getFeaturedBlogs: () => {
        return get().blogs.filter(blog => blog.is_featured);
      },

      // Get blogs by category
      getBlogsByCategory: (categorySlug: string) => {
        return get().blogs.filter(blog => 
          blog.tags.some(tag => tag.toLowerCase() === categorySlug.toLowerCase())
        );
      },

      // Clear current blog
      clearCurrentBlog: () => {
        set({ currentBlog: null });
      },
    }),
    {
      name: 'blog-storage-rq',
      // Only persist the blog data
      partialize: (state) => ({
        blogs: state.blogs,
        currentBlog: state.currentBlog,
        pagination: state.pagination,
      }),
    }
  )
);

// Selector hooks for common use cases
export const useBlogListRQ = () => {
  return useBlogStoreRQ((state) => state.blogs);
};

export const useCurrentBlogRQ = () => {
  return useBlogStoreRQ((state) => state.currentBlog);
};

export const useFeaturedBlogsRQ = () => {
  return useBlogStoreRQ((state) => state.getFeaturedBlogs());
};

export const useBlogPaginationRQ = () => {
  return useBlogStoreRQ((state) => state.pagination);
};

export const useBlogBySlugRQ = (slug: string) => {
  return useBlogStoreRQ((state) => state.getBlogBySlug(slug));
};
