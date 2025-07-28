"use client";

import { useEffect } from "react";
import { useBlogs, useBlogBySlug, useBlogByPopular } from "@/hooks/api";
import { useBlogStoreRQ } from "@/stores/blogStoreRQ";
import { BlogsParams } from "@/types/api";

export const useBlogsWithStore = (
  params: BlogsParams & { enabled?: boolean } = {}
) => {
  const { setBlogs, setPagination } = useBlogStoreRQ();

  const { enabled, per_page, ...blogParams } = params;
  const query = useBlogs(per_page || 6, {
    enabled: enabled !== false && typeof window !== "undefined",
  });

  // Update Zustand store when React Query data changes
  useEffect(() => {
    if (query.data) {
      setBlogs(query.data.data?.items || []);
      setPagination({
        current_page: query.data.data?.current_page || 1,
        last_page: query.data.data?.last_page || 1,
        per_page: query.data.data?.per_page || 6,
        total: query.data.data?.total || 0,
      });
    }
  }, [query.data, setBlogs, setPagination]);

  return {
    ...query,
    // Expose store methods for backward compatibility
    getBlogBySlug: useBlogStoreRQ((state) => state.getBlogBySlug),
    getFeaturedBlogs: useBlogStoreRQ((state) => state.getFeaturedBlogs),
    getBlogsByCategory: useBlogStoreRQ((state) => state.getBlogsByCategory),
  };
};

export const useBlogBySlugWithStore = (slug: string) => {
  const { setCurrentBlog } = useBlogStoreRQ();

  const query = useBlogBySlug(slug);

  // Update Zustand store when React Query data changes
  useEffect(() => {
    if (query.data) {
      setCurrentBlog(query.data);
    }
  }, [query.data, setCurrentBlog]);

  return {
    ...query,
    // Expose store methods for backward compatibility
    clearCurrentBlog: useBlogStoreRQ((state) => state.clearCurrentBlog),
  };
};

export const useBlogPopularWithStore = (limit: number) => {
  const { setCurrentBlog } = useBlogStoreRQ();

  const query = useBlogByPopular(limit);

  // Update Zustand store when React Query data changes
  useEffect(() => {
    if (query.data) {
      setCurrentBlog(query.data);
    }
  }, [query.data, setCurrentBlog]);

  return {
    ...query,
    // Expose store methods for backward compatibility
    clearCurrentBlog: useBlogStoreRQ((state) => state.clearCurrentBlog),
  };
};
