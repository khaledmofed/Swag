import React from "react"
import Banner from "./banner"
import EconomicCalendarWidget from "./economicCalenderWidget"
import LatestNews from "./latest-news"

export default function MarketInsights() {
  return (
    <div className="pb-6">
      <Banner />
      <EconomicCalendarWidget />
      <LatestNews />
    </div>
  )
}
