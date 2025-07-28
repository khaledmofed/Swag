import React from "react"
import TradingViewWidget from "./chart-widget"
import LivePriceWidget from "./LivePriceWidget"

export default function Banner() {
  return (
    <div className="min-h-[84vh] bg-secondary-600 pt-32  text-white">
      <LivePriceWidget />

      <div className="h-[40vh] md:h-[50vh] w-full container">
        <TradingViewWidget />
      </div>
    </div>
  )
}
