"use client";

import { useRef } from "react";
import { useLivePricesSocket } from "@/hooks/api/useLivePricesSocket";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useMarketPrices } from "@/hooks";
import { useTranslation } from "react-i18next";
import Icon from "../common/Icon";

// Loading skeleton component
function LivePriceWidgetSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 px-4 gap-4 border-y border-opacity-30 border-secondary-100 mb-6 py-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "text-center",
            index !== 3 && "md:border-r border-secondary-100/30"
          )}
        >
          {/* Title skeleton */}
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-100 dark:via-gray-100 dark:to-gray-100 rounded-md mb-2 mx-auto w-24 bg-[length:200%_100%] animate-shimmer"></div>

          {/* Price skeleton */}
          <div className="flex items-center justify-center gap-1">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-50 dark:from-gray-100 dark:via-gray-100 dark:to-gray-100 rounded-md w-20 bg-[length:200%_100%] animate-shimmer"></div>
            <div className="h-4 w-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-50 dark:from-gray-100 dark:via-gray-100 dark:to-gray-100 rounded-full bg-[length:200%_100%] animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

const sortedKeys = [
  "gold-price-region24", // GOLD 24
  "gold-price-region21", // GOLD 21
  "goldsounces", // GOLD
  "silversounces", // SILVER
];

const initialPrices: Record<string, number | null> = {
  "gold-price-region24": null,
  "gold-price-region21": null,
  goldsounces: null,
  silversounces: null,
};

export default function LivePriceWidget() {
  const { t } = useTranslation();
  const prevPricesRef = useRef(initialPrices);
  const { data: link } = useMarketPrices();
  const { data: prices = initialPrices, isConnected } =
    useLivePricesSocket(link);

  // Update previous prices ref when prices change
  if (prices !== prevPricesRef.current) {
    prevPricesRef.current = { ...prevPricesRef.current, ...prices };
  }

  const displayNames: Record<string, string> = {
    "gold-price-region24": t("live_market_insights.gold_price_region24"),
    "gold-price-region21": t("live_market_insights.gold_price_region21"),
    goldsounces: t("live_market_insights.goldsounces"),
    silversounces: t("live_market_insights.silversounces"),
  };

  // Show skeleton if not connected or if all prices are null
  const isLoading =
    !isConnected || Object.values(prices).every((price) => price === null);

  if (isLoading) {
    return <LivePriceWidgetSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 px-4 gap-4 border-y border-opacity-30 border-secondary-100 mb-6 py-4">
      {sortedKeys.map((key, index) => {
        const value = prices[key];
        const prevValue = prevPricesRef.current[key];
        const hasChanged = prevValue !== null && value !== null;
        const isUp = hasChanged ? value! > prevValue! : null;

        return (
          <div
            key={index}
            className={cn(
              "text-center",
              index !== sortedKeys.length - 1 &&
                "md:border-r border-secondary-100/30"
            )}
          >
            <h3 className="text-2xl font-semibold">{displayNames[key]}</h3>
            <p
              className={cn(
                "text-lg font-bold tracking-wide flex items-center justify-center gap-1",
                isUp === true && "text-green-500",
                isUp === false && "text-red-500",
                isUp === null && "text-gray-400"
              )}
            >
              {value !== null ? (
                <>
                  {value?.toFixed(2)}{" "}
                  <Icon
                    name="riyal"
                    size={"18"}
                    className={cn(
                      isUp === true && "fill-green-500",
                      isUp === false && "fill-red-500",
                      isUp === null && "fill-gray-400"
                    )}
                  />
                  {isUp === true && <ArrowUpRight size={18} />}
                  {isUp === false && <ArrowDownRight size={18} />}
                </>
              ) : (
                <div className="h-6 w-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-50 dark:from-gray-100 dark:via-gray-100 dark:to-gray-700 rounded-md bg-[length:200%_100%] animate-shimmer"></div>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
