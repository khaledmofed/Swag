"use client"

import { useBreakingNews } from "@/hooks/api"
import NewsItem from "./NewsItem"

interface NewsData {
  title: string
  link: string
  pubDate: string
  content?: string
  image?: string
  source: string
}

const BreakingNews = () => {
  const { data: news = [], isLoading: loading, error } = useBreakingNews()

  return (
    <div className="space-y-6 ">
      {news.map((item, index) => (
        <NewsItem
          key={index}
          title={item.title}
          link={item.link}
          pubDate={item.pubDate}
          content={item.content}
          image={item.image || undefined}
          source="Breaking News"
        />
      ))}
    </div>
  )
}

export default BreakingNews
