"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import Icon from "../common/Icon";
import { useSystemSettingsStore } from "@/stores";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

export function DiscoverSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [aboutImageUrl, setAboutImageUrl] = useState<string | null>(null);
  const [aboutHeadline, setAboutHeadline] = useState<string>("");
  const [aboutDescription, setAboutDescription] = useState<string>("");
  const [aboutCtaUrl, setAboutCtaUrl] = useState<string>("");

  const { getSettingValue } = useSystemSettingsStore();

  useEffect(() => {
    setIsClient(true);
    const imageUrl = getSettingValue("ABOUT_IMAGE_URL");
    const headline = getSettingValue("ABOUT_HEADLINE");
    const description = getSettingValue("ABOUT_DESCRIPTION");
    const ctaUrl = getSettingValue("ABOUT_CTA_URL");

    setAboutImageUrl(imageUrl);
    setAboutHeadline(headline || t("discover.title"));
    setAboutDescription(description || t("discover.company_story"));
    setAboutCtaUrl(ctaUrl || "/about");
  }, [getSettingValue, t]);

  const handleGoToAbout = () => {
    router.push(aboutCtaUrl);
  };

  // Get the image URL safely
  const imageSrc = aboutImageUrl
    ? getImageUrl(aboutImageUrl)
    : "/images/discover/jewelry-model.png";

  // Don't render during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <section className="py-20 bg-primary-50 dark:bg-secondary-600 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="py-20 bg-primary-50  dark:bg-secondary-600   relative "
    >
      {/* <div className=" absolute -top-8 right-1 z-10">
        <div className="w-16 h-16 flex items-center justify-center ">
          <Icon name="sun-icon" size={20} className="text-white" />
        </div>
      </div> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        <div className=" container  w-full absolute top-0" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-light text-gray-900 dark:text-white leading-tight">
                {aboutHeadline}
              </h2>
            </div>

            <div className="space-y-8 mt-10">
              <p className="text-gray-950 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
                {aboutDescription}
              </p>
            </div>
            <div>
              <Icon onClick={handleGoToAbout} name="Asset" size={128} />
            </div>
          </div>

          {/* Right Content - Image with border and stars */}
          <div className="relative p-8 border border-1 border-gray-500">
            {/* Top-right icon */}

            <div className="absolute left-[-37px] z-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <div className="absolute -top-6 -left-6 ">
                <Icon name="star4" size={28} />
              </div>
              <div className="absolute top-20 -left-1 ">
                <Icon name="star3" size={24} className="absolute top-1/3" />
              </div>
              <div className="z-4 relative">
                <Icon name="star2" size={20} />
              </div>
            </div>
            <div className="relative  overflow-hidden aspect-[3/4]">
              {/* Decorative stars */}

              {/* Image */}
              <Image
                src={imageSrc}
                alt="Elegant jewelry model"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
