'use client'

import { useEffect } from 'react'
import { useFooter } from '@/hooks/api'
import { useFooterStore } from '@/stores/footerStore'

export const useFooterWithStore = (options: { enabled?: boolean } = {}) => {
  const { setFooter } = useFooterStore()

  const query = useFooter({
    enabled: options.enabled !== false && typeof window !== 'undefined'
  })
  
  // Update Zustand store when React Query data changes
  useEffect(() => {
    if (query.data) {
      setFooter(query.data)
    }
  }, [query.data, setFooter])
  
  return query
}
