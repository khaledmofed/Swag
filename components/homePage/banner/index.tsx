"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { useLanguageStore } from "@/stores/languageStore";
import { useSystemSetting } from "@/stores";

export default function Banner() {
  const [data, setData] = useState<any>(null);
  const { isRTL } = useLanguageStore();
  const headline = useSystemSetting("HERO_BANNER_HEADLINE");
  const description = useSystemSetting("HERO_BANNER_DESCRIPTION");
  const ctaText = useSystemSetting("HERO_BANNER_CTA_TEXT");
  const ctaUrl = useSystemSetting("HERO_BANNER_CTA_URL");
  const videoUrl = useSystemSetting("HERO_BANNER_VIDEO_URL");

  useEffect(() => {
    setData({
      headline,
      description,
      ctaText,
      ctaUrl,
      videoUrl,
    });
  }, [headline, description, ctaText, ctaUrl, videoUrl]);
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/y3Qm70rLMTs?autoplay=1&mute=1&loop=1&playlist=y3Qm70rLMTs&controls=0"
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="absolute inset-0 w-full h-full object-cover sizeIframe"
      ></iframe>
      {/* <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={"/images/jewelry-banner-poster.png"}
      > */}
      {/* Always render <source> with fallback empty string to avoid hydration mismatch */}
      {/* <source src={"/videos/jewelry-banner.mp4"} type="video/mp4" /> */}
      {/* </video> */}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/28" />

      {/* Content Container */}
      <div className="relative z-10 flex items-end justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-4 sm:mb-6 lg:mb-8 items-center min-h-[15vh] sm:min-h-[17.5vh]">
            <>
              <h1 className="justify-start text-primary-50 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-tight sm:leading-[1.2] md:leading-[1.3] lg:leading-[56px]">
                {data?.headline}
              </h1>
              <div>
                <p className="text-base sm:text-lg lg:text-xl text-primary-50 leading-relaxed mb-4 sm:mb-6 lg:mb-8">
                  {data?.description}
                </p>
                <a
                  href={data?.ctaUrl}
                  className="flex items-center gap-1 sm:gap-2"
                >
                  <p className="text-base sm:text-lg lg:text-xl text-primary-300">
                    {data?.ctaText}
                  </p>
                  <Icon
                    name={isRTL ? "arrow-left" : "arrow-right"}
                    size={16}
                    className="sm:w-5 sm:h-5 text-primary-300"
                  />
                </a>
              </div>
            </>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
