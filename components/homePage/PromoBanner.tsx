"use client";

import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import {
  useSystemSettingsWithStore,
  useMarketPrices,
  useLivePricesSocket,
} from "@/hooks";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PromoBannerProps {
  speed?: "slow" | "normal" | "fast" | "very-fast";
}

// Price keys and initial values
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

export function PromoBanner({ speed = "normal" }: PromoBannerProps) {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguageStore();
  const { getSettingByKey, data: settingsData } = useSystemSettingsWithStore({
    enabled: typeof window !== "undefined",
  });
  const [isClient, setIsClient] = useState(false);
  const [listText, setListText] = useState<string[]>([]);

  // Live prices hooks
  const prevPricesRef = useRef(initialPrices);
  const { data: link } = useMarketPrices();
  const { data: prices = initialPrices, isConnected } =
    useLivePricesSocket(link);

  // Use live prices only, no fallback data
  const displayPrices = prices;

  // Update previous prices ref when prices change
  if (prices !== prevPricesRef.current) {
    prevPricesRef.current = { ...prevPricesRef.current, ...prices };
  }

  useEffect(() => {
    setIsClient(true);

    const settingValue = getSettingByKey("PROMOTION_BANNER_LIST_TEXT")?.value;
    let nextList: unknown = Array.isArray(settingValue) ? settingValue : [];

    if (!Array.isArray(nextList) || nextList.length === 0) {
      const translated = t("promo.list", { returnObjects: true }) as unknown;
      nextList = Array.isArray(translated) ? translated : [];
    }

    setListText((nextList as string[]) || []);
  }, [getSettingByKey, settingsData, language, t]);

  // Display names for prices
  const displayNames: Record<string, string> = {
    "gold-price-region24": t("live_market_insights.gold_price_region24"),
    "gold-price-region21": t("live_market_insights.gold_price_region21"),
    goldsounces: t("live_market_insights.goldsounces"),
    silversounces: t("live_market_insights.silversounces"),
  };

  // Price component for marquee - same format as LivePriceWidget
  const PriceItem = ({
    priceKey,
    index,
  }: {
    priceKey: string;
    index: number;
  }) => {
    const value = (displayPrices as any)[priceKey];
    const prevValue = prevPricesRef.current[priceKey];
    const hasChanged = prevValue !== null && value !== null;
    const isUp = hasChanged ? value! > prevValue! : null;

    return (
      <div className="flex items-center">
        <span
          className="font-sukar text-black font-medium text-sm sm:text-base flex items-center gap-1 sm:gap-2"
          style={{ color: "rgb(0, 0, 0)" }}
        >
          <span className="font-semibold">{displayNames[priceKey]}:</span>
          {value !== null ? (
            <>
              <span
                className={cn(
                  "font-bold",
                  isUp === true && "text-green-500",
                  isUp === false && "text-red-500",
                  isUp === null && "text-gray-400"
                )}
              >
                {value?.toFixed(2)}
              </span>
              <Icon
                name="riyal"
                size={14}
                className={cn(
                  "sm:w-4 sm:h-4",
                  isUp === true && "fill-green-500",
                  isUp === false && "fill-red-500",
                  isUp === null && "fill-gray-400"
                )}
              />
              {isUp === true && (
                <ArrowUpRight size={14} className="text-green-500" />
              )}
              {isUp === false && (
                <ArrowDownRight size={14} className="text-red-500" />
              )}
            </>
          ) : (
            <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-50 dark:from-gray-100 dark:via-gray-100 dark:to-gray-700 rounded bg-[length:200%_100%] animate-shimmer"></div>
          )}
        </span>

        {/* Diamond Icon */}
        <div className="px-2 sm:px-4">
          <Icon name="vector" size={6} className="sm:w-2 sm:h-2" />
        </div>
      </div>
    );
  };

  // Don't render during SSR to prevent hydration mismatch
  if (!isClient || !listText || listText.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-primary-400 dark:bg-primary-100 text-custom-borderLight dark:border dark:border-primary-100 dark:text-secondary-500">
        <div className="py-2 sm:py-4 h-12 sm:h-16 flex items-center justify-center">
          <div className="animate-pulse bg-white/20 h-4 w-32 rounded"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-primary-400 dark:bg-primary-100 text-custom-borderLight  dark:border dark:border-primary-100 dark:text-secondary-500 ">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
      </div>

      {/* Decorative Elements */}

      {/* Marquee Container */}
      <div
        className={`marquee-container relative py-2 sm:py-4 h-12 sm:h-16 flex items-center marquee-${speed}`}
      >
        <div className="flex items-center whitespace-nowrap">
          {/* Multiple copies of the text for seamless loop */}
          <div
            className={cn(
              `inline-flex items-center`,
              isRTL ? "marquee-rtl" : "marquee"
            )}
          >
            {/* Repeat the content multiple times for seamless infinite loop */}
            {/* Regular promo text items - repeat multiple times */}
            {/* {Array.from({ length: 2 }, (_, repeatIndex) =>
              listText.map((item: string, index: number) => (
                <div
                  key={`promo-${index}-${repeatIndex}`}
                  className="flex items-center"
                >
                  <span
                    className="font-sukar text-black font-medium text-sm sm:text-base flex items-center gap-1 sm:gap-2"
                    style={{ color: "#000" }}
                  >
                    <Icon
                      name="check"
                      size={16}
                      className={cn("sm:w-5 sm:h-5", isRTL ? "ml-1" : "mr-1")}
                    />
                    {item}
                  </span>

                  <div className="px-2 sm:px-4">
                    <Icon name="vector" size={6} className="sm:w-2 sm:h-2" />
                  </div>
                </div>
              ))
            )} */}

            {/* Live prices items - repeat multiple times for seamless loop */}
            {Object.values(prices).some((price) => price !== null) &&
              // Repeat the prices 3 times for better marquee effect
              Array.from({ length: 3 }, (_, repeatIndex) =>
                sortedKeys.map((priceKey, index) => (
                  <PriceItem
                    key={`price-${priceKey}-${repeatIndex}`}
                    priceKey={priceKey}
                    index={index}
                  />
                ))
              )}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    </section>
  );
}
