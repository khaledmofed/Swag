'use client';

import { QueryClient } from '@tanstack/react-query';

// Global query client reference
let globalQueryClient: QueryClient | null = null;

/**
 * Set the global query client reference
 * This should be called from the QueryClientProvider
 */
export const setGlobalQueryClient = (client: QueryClient) => {
  globalQueryClient = client;
};

/**
 * Get the global query client reference
 */
export const getGlobalQueryClient = (): QueryClient | null => {
  return globalQueryClient;
};

/**
 * Invalidate all queries when language changes
 * This will trigger a refetch of all cached data with the new language
 */
export const invalidateAllQueries = async () => {
  if (globalQueryClient) {
    try {
      // Invalidate all queries to refetch with new language
      await globalQueryClient.invalidateQueries();
    } catch (error) {
      console.error('Error invalidating queries:', error);
    }
  } else {
    console.warn('Query client not available for invalidation');
  }
};

/**
 * Invalidate specific query patterns
 * Useful for invalidating only certain types of queries
 */
export const invalidateQueriesByPattern = async (patterns: string[]) => {
  if (globalQueryClient) {
    try {
      for (const pattern of patterns) {
        await globalQueryClient.invalidateQueries({
          queryKey: [pattern],
        });
      }
    } catch (error) {
      console.error('Error invalidating specific queries:', error);
    }
  }
};
