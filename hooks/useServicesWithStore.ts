'use client'

import { useEffect } from 'react'
import { useServices, useActiveServices } from '@/hooks/api'
import { useServicesStoreRQ } from '@/stores/servicesStoreRQ'

export const useServicesWithStore = () => {
  const { setServices } = useServicesStoreRQ()
  
  const query = useServices()
  
  // Update Zustand store when React Query data changes
  useEffect(() => {
    if (query.data) {
      setServices(query.data)
    }
  }, [query.data, setServices])
  
  return {
    ...query,
    // Expose store methods for backward compatibility
    getServiceBySlug: useServicesStoreRQ(state => state.getServiceBySlug),
    getActiveServices: useServicesStoreRQ(state => state.getActiveServices),
  }
}

export const useActiveServicesWithStore = (options: { enabled?: boolean } = {}) => {
  const { setServices } = useServicesStoreRQ()

  const query = useActiveServices({
    enabled: options.enabled !== false && typeof window !== 'undefined'
  })
  
  // Update Zustand store when React Query data changes
  useEffect(() => {
    if (query.data) {
      setServices(query.data)
    }
  }, [query.data, setServices])
  
  return {
    ...query,
    // Expose store methods for backward compatibility
    getServiceBySlug: useServicesStoreRQ(state => state.getServiceBySlug),
    getActiveServices: useServicesStoreRQ(state => state.getActiveServices),
  }
}
