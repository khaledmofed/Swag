import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'
import { useMarketPrices } from './useLiveMarketInsights'

interface PriceChange {
  priceName: string
  newPrice: number
}

interface SocketData {
  priceChanges: PriceChange[]
}

interface LivePricesData {
  [key: string]: number | null
}

const initialPrices: LivePricesData = {
  "gold-price-region24": null,
  "gold-price-region21": null,
  goldsounces: null,
  silversounces: null
}

export const useLivePricesSocket = (link: string) => {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const query = useQuery({
    queryKey: ['livePricesSocket'],
    queryFn: () => Promise.resolve(initialPrices),
    staleTime: Infinity, // Never stale since we update via socket
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(link || "https://concat-erp.com:3004")

    const socket = socketRef.current

    socket.on("connect", () => {
      console.log("✅ Socket Connected")
    })

    socket.on("disconnect", () => {
      console.warn("⚠️ Disconnected")
    })

    socket.on("price_update", (data: SocketData) => {
      // Update React Query cache with new price data
      queryClient.setQueryData(['livePricesSocket'], (oldData: LivePricesData | undefined) => {
        const updated = oldData ? { ...oldData } : { ...initialPrices }

        data.priceChanges.forEach(({ priceName, newPrice }: PriceChange) => {
          if (priceName in updated) {
            updated[priceName] = newPrice
          }
        })

        return updated
      })
    })

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [queryClient])

  return {
    ...query,
    isConnected: socketRef.current?.connected || false,
    disconnect: () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    },
    reconnect: () => {
      if (socketRef.current) {
        socketRef.current.connect()
      }
    }
  }
}

// Hook to get a specific price by key
export const useLivePriceByKey = (priceKey: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['livePricesSocket', priceKey],
    queryFn: () => {
      const data = queryClient.getQueryData<LivePricesData>(['livePricesSocket'])
      return data?.[priceKey] || null
    },
    enabled: false, // We'll update this manually
  })
}

// Hook to get all live prices
export const useAllLivePrices = () => {
  return useQuery({
    queryKey: ['livePricesSocket'],
    queryFn: () => Promise.resolve(initialPrices),
    staleTime: Infinity,
  })
}
