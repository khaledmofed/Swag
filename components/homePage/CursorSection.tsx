"use client";

import { ImageSlider } from "@/components/common/ImageSlider";
import { useSystemSettingsStore } from "@/stores";
import { getImageUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

export function CursorSection() {
  const { getSettingValue } = useSystemSettingsStore();
  const [isClient, setIsClient] = useState(false);
  const [cursorImages, setCursorImages] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
    const images = (getSettingValue("IMAGES_SECTION_LIST") || []).map(
      (image: string) => {
        return {
          src: getImageUrl(image),
          alt: "Elegant jewelry collection showcase",
        };
      }
    );
    setCursorImages(images);
  }, [getSettingValue]);

  // Don't render during SSR to prevent hydration mismatch
  if (!isClient || cursorImages.length === 0) {
    return (
      <section className="w-full">
        <div className="animate-pulse bg-gray-200 h-64 w-full"></div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <ImageSlider
        images={cursorImages}
        autoplay={true}
        autoplayDelay={5000}
        className="w-full"
      />
    </section>
  );
}
