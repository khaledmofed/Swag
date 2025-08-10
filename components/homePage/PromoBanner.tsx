"use client";

import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSystemSettingsWithStore } from "@/hooks";

interface PromoBannerProps {
  speed?: "slow" | "normal" | "fast" | "very-fast";
}

export function PromoBanner({ speed = "normal" }: PromoBannerProps) {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguageStore();
  const { getSettingByKey, data: settingsData } = useSystemSettingsWithStore({
    enabled: typeof window !== "undefined",
  });
  const [isClient, setIsClient] = useState(false);
  const [listText, setListText] = useState<string[]>([]);

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
            {listText.map((item: string, index: number) => (
              <div key={`promo-${index}`} className="flex items-center">
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

                {/* Diamond Icon */}
                <div className="px-2 sm:px-4">
                  <Icon name="vector" size={6} className="sm:w-2 sm:h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    </section>
  );
}
