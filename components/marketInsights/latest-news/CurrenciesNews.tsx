"use client"

import { useCurrenciesNews } from "@/hooks/api"
import NewsItem from "./NewsItem"

interface NewsData {
  title: string
  link: string
  pubDate: string
  content?: string
  image?: string
  source: string
}

const CurrenciesNews = () => {
  const { data: news = [], isLoading: loading, error } = useCurrenciesNews()

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {news.map((item, index) => (
        <NewsItem
          key={index}
          title={item.title}
          link={item.link}
          pubDate={item.pubDate}
          content={item.content}
          image={item.image || undefined}
          source="Currencies"
        />
      ))}
    </div>
  )
}

export default CurrenciesNews
