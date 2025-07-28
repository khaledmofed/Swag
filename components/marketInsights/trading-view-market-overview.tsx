"use client"

import { useThemeStore } from "@/stores"
import { useEffect, useRef } from "react"

export default function TradingViewMarketOverview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { mode } = useThemeStore()

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement("script")
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      colorTheme: mode === "dark" ? "dark" : "light",
      dateRange: "1M",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      width: "100%",
      height: "550",
      plotLineColorGrowing: "rgba(39, 78, 19, 0.87)",
      plotLineColorFalling: "rgba(217, 234, 211, 1)",
      gridLineColor: "rgba(46, 46, 46, 0)",
      scaleFontColor: "rgba(15, 15, 15, 1)",
      belowLineFillColorGrowing: "rgba(182, 215, 168, 0.12)",
      belowLineFillColorFalling: "rgba(217, 234, 211, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(182, 215, 168, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      tabs: [
        {
          title: "Indices",
          symbols: [
            { s: "CMCMARKETS:US30", d: "US 30 Cash" },
            { s: "EIGHTCAP:SPX500", d: "US 500 Cash" },
            { s: "NASDAQ:IXIC", d: "NASDAQ Composite (IXIC)" },
            { s: "PEPPERSTONE:VIX", d: "CBOE Volatility Index" }
          ],
          originalTitle: "Indices"
        },
        {
          title: "Commodities",
          symbols: [
            { s: "TVC:USOIL", d: "Crude Oil WTI" },
            { s: "TVC:UKOIL", d: "Brent Oil" },
            { s: "OANDA:NATGASUSD", d: "Natural Gas" },
            { s: "OANDA:XAUUSD", d: "Gold (USD)" },
            { s: "OANDA:XAGUSD", d: "Silver (USD)" }
          ]
        },
        {
          title: "Stocks",
          symbols: [
            { s: "NASDAQ:AAPL", d: "Apple" },
            { s: "NASDAQ:NVDA", d: "NVIDIA" },
            { s: "NASDAQ:GOOGL", d: "Alphabet A" },
            { s: "NASDAQ:TSLA", d: "Tesla" },
            { s: "NASDAQ:AMZN", d: "Amazon.com" },
            { s: "NASDAQ:NFLX", d: "Netflix" },
            { s: "NASDAQ:META", d: "Meta Platforms" }
          ]
        }
      ]
    })

    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(script)
  }, [])

  return (
    <section className=" py-8 bg-white dark:bg-secondary-600 dark:text-white-50 rounded-xl">
      <div className="tradingview-widget-container" ref={containerRef}></div>
    </section>
  )
}
