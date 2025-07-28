"use client"

import React, { useRef, memo } from "react"
import Icon from "../common/Icon"
import { useTranslation } from "react-i18next"

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  // Custom intervals and chart styles
  const intervals = ["5", "20", "35", "50", "60", "D"]
  const styles = [
    { name: "Candles", value: "1", icon: "candle" },
    { name: "Bars", value: "0", icon: "bar" },
    { name: "Line", value: "2", icon: "line" }
  ]
  const [interval, setInterval] = React.useState("20")
  const [chartStyle, setChartStyle] = React.useState("1")

  const reloadChart = () => {
    if (!container.current) return
    container.current.innerHTML = "" // Clear previous chart

    const script = document.createElement("script")
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "TVC:GOLD",
      interval: interval,
      theme: "dark",
      style: chartStyle,
      timezone: "Etc/UTC",
      locale: "en",
      hide_legend: true,
      allow_symbol_change: false,
      hide_top_toolbar: true,
      save_image: false,
      hide_volume: false,
      backgroundColor: "#2E2E2E",

      containerBackgroundColor: "transparent",
      overrides: {
        "paneProperties.background": "#2E2E2E",
        "paneProperties.vertGridProperties.color": "#44444420",
        "paneProperties.horzGridProperties.color": "#44444420",
        "mainSeriesProperties.candleStyle.upColor": "#00ffb0",
        "mainSeriesProperties.candleStyle.downColor": "#ff3c61",
        "mainSeriesProperties.candleStyle.borderUpColor": "#00ffb0",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ff3c61",
        "mainSeriesProperties.candleStyle.wickUpColor": "#00ffb0",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ff3c61",
        "scalesProperties.textColor": "#ffffff",
        "scalesProperties.lineColor": "#ffffff10",
        "crossHairProperties.color": "#ffffff",
        "paneProperties.legendProperties.showLegend": false,
        "paneProperties.legendProperties.showStudyArguments": false,
        "paneProperties.legendProperties.showSeriesTitle": false,
        "paneProperties.legendProperties.showValues": false
      }
      // support_host: "https://www.tradingview.com"
    })

    container.current.appendChild(script)
  }

  React.useEffect(() => {
    reloadChart()
    // eslint-disable-next-line
  }, [interval, chartStyle])

  return (
    <div className="space-y-4 h-full">
      <div className="flex justify-between items-center text-white dark:text-black-500 text-sm px-2">
        <div className="flex space-x-2 items-center">
          <p className="text-sm text-black-500 dark:text-white-50">{t("chart.time")}</p>
          {intervals.map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={`px-2 py-1 rounded ${
                interval === i
                  ? "bg-white text-black"
                  : "bg-secondary-600 text-white "
              }`}
            >
              {i === "D" ? "D" : i === "60" ? "1 h" : `${i} m`}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          {styles.map((s) => (
            <button
              title={s.name}
              key={s.value}
              onClick={() => setChartStyle(s.value)}
              className={`px-2 py-1 rounded ${
                chartStyle === s.value
                  ? "bg-white text-black"
                  : "bg-secondary-600 text-white "
              }`}
            >
              <Icon name={s.icon as any} size={16} />
            </button>
          ))}
        </div>
      </div>
      <div
        className="tradingview-widget-container w-full h-full"
        ref={container}
      >
        <div className="tradingview-widget-container__widget h-full w-full" />
      </div>
    </div>
  )
}

export default memo(TradingViewWidget)
