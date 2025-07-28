"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BreakingNews from "./BreakingNews"
import CurrenciesNews from "./CurrenciesNews"
import CommoditiesNews from "./CommoditiesNews"
import StockMarketsNews from "./StockMarketsNews"
import { useTranslation } from "react-i18next"
import { useLiveMarketInsights } from "@/hooks"
import { useLanguageStore } from "@/stores"

const LatestNews = () => {
  const [activeTab, setActiveTab] = useState("breaking")
  const { t } = useTranslation()
  const {isRTL} = useLanguageStore()
  const { data } = useLiveMarketInsights()


  const news = data?.news
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }
  const tabs = [
    {
      value: "breaking",
      label: t("latest_news.tabs.breaking"),
      content: <BreakingNews />
    },
    {
      value: "currencies",
      label: t("latest_news.tabs.currencies"),
      content: <CurrenciesNews />
    },
    {
      value: "commodities",
      label: t("latest_news.tabs.commodities"),
      content: <CommoditiesNews />
    },
    {
      value: "stocks",
      label: t("latest_news.tabs.stocks"),
      content: <StockMarketsNews />
    }
  ]

  return (
    <div className=" mx-auto container md:max-w-[70%]">
      <div className="mb-8">
        <p className="text-lg mb-2">{news?.caption}</p>
        <h1 className="text-6xl font-light mb-8">{news?.headline}</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-transparent border-b rounded-none h-auto p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-left justify-start rounded-none pb-4"
              active={activeTab === tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default LatestNews
