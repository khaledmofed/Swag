"use client";

import TradingViewMarketOverview from "./trading-view-market-overview";
// import { useLiveMarketData } from "@/stores"
import { useLiveMarketInsights } from "@/hooks";

export default function EconomicCalendarWidget() {
  const { data } = useLiveMarketInsights();

  const economic_calendar = data?.economic_calendar;
  // This useEffect is only effective if the script injects DOM into the page (not inside its own iframe)

  return (
    <section className="py-12 bg-white dark:bg-secondary-600 px-4 sm:px-6 lg:px-0  container mx-auto">
      <div className="text-center flex flex-col gap-3 mb-12">
        <p className="text-primary-500 text-lg uppercase tracking-wider mb-2">
          {economic_calendar?.caption}
        </p>
        <h2 className="text-3xl md:text-6xl font-light text-secondary-500 dark:text-white-500">
          {economic_calendar?.headline}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          {economic_calendar?.description}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:max-w-[80%] mx-auto gap-4 items-start ">
        <div className="w-full h-full md:w-[50%]">
          <div className="relative w-full min-h-[500px] md:aspect-[6/5.1]">
            <iframe
              width={"100%"}
              height={"100%"}
              title="Economic Calendar Widget"
              src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=week&timeZone=8&lang=1"
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>
        </div>

        <div className="w-full h-full md:w-[50%]">
          <TradingViewMarketOverview />
        </div>
      </div>
    </section>
  );
}
