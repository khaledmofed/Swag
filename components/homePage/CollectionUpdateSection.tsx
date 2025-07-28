"use client";

import { Button } from "@/components/ui/button";
import { ImageSlider } from "../common/ImageSlider";
import { useSystemSettingsStore } from "@/stores";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

export function CollectionUpdateSection() {
  const router = useRouter();
  const { getSettingValue } = useSystemSettingsStore();
  const [isClient, setIsClient] = useState(false);
  const [cursorImages, setCursorImages] = useState<any[]>([]);
  const [shopNowHeadline, setShopNowHeadline] = useState<string>("");
  const [shopNowCtaText, setShopNowCtaText] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
    const images = (getSettingValue("SHOP_NOW_PROMOTION_IMAGES") || []).map(
      (image: string) => {
        return {
          src: getImageUrl(image),
          alt: "Elegant jewelry collection showcase",
        };
      }
    );
    const headline = getSettingValue("SHOP_NOW_HEADLINE");
    const ctaText = getSettingValue("SHOP_NOW_CTA_TEXT");

    setCursorImages(images);
    setShopNowHeadline(headline || "Shop Now");
    setShopNowCtaText(ctaText || "Shop Now");
  }, [getSettingValue]);

  const handleShopNow = () => {
    router.push("/store");
  };

  // Don't render during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <section className="bg-primary-50 dark:bg-primary-100 relative overflow-hidden">
        <div className="flex flex-col-reverse md:flex-row justify-between gap-12 lg:gap-16 items-start md:items-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="animate-pulse bg-gray-200 h-64 w-full md:w-1/2"></div>
        </div>
      </section>
    );
  }

  return (
    <section className=" bg-primary-50 dark:bg-primary-100 relative overflow-hidden">
      <div className="flex flex-col-reverse md:flex-row justify-between gap-12 lg:gap-16 items-start md:items-center">
        {/* Left Content */}
        <div className="space-y-8 justify-end flex flex-col items-center md:mx-[6rem] mb-14  ">
          <div className="mx-4  flex flex-col items-center ">
            <h2 className="text-4x max-w-2xl lg:text-5xl  text-primary-600 ">
              {shopNowHeadline}
            </h2>

            {/* Shop Now Button */}
            <div className="pt-4 self-start">
              <Button
                onClick={handleShopNow}
                className="bg-secondary-500 
              text-white-50 px-8 py-4 text-lg font-semibold 
              transition-all duration-300 hover:scale-104 rounded-none min-h-[56px]
              flex items-center gap-3 group"
              >
                {shopNowCtaText}
              </Button>
            </div>
          </div>
        </div>

        <div className=" w-full md:max-w-[479px] max-h-[403px] ">
          <ImageSlider
            images={cursorImages}
            autoplay={true}
            autoplayDelay={5000}
            noArrows
            noCounter
            noOverlay
            classImage="w-full md:max-w-[479px] max-h-[403px] h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
