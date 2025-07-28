"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";

const sliderImages = [
  "/images/store-slider/slide1.png",
  "/images/store-slider/slide2.png",
  "/images/store-slider/slide3.png",
  // أضف المزيد حسب الحاجة
];

const sliderData = [
  {
    image: "/images/store-slider/slide1.png",
    title: "The Enchanted City Ring Collection",
    author: "Elena Voss",
    price: "$2035.00",
  },
  {
    image: "/images/store-slider/slide2.png",
    title: "Delicate Floral Gold Stud Earring",
    author: "Marcus Lee",
    price: "$2035.00",
  },
  {
    image: "/images/store-slider/slide3.png",
    title: "Modern Minimalist Bracelet",
    author: "Sara Kim",
    price: "$2035.00",
  },
];

export function StoreHeroSection() {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: "trimSnaps",
    },
    [autoplay.current]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full py-12 ">
      <div className="w-full flex flex-col md:flex-row items-center gap-12 mobile-collections-section">
        {/* اليسار */}
        <div
          className={`flex-1 ${
            isRTL
              ? "text-right pr-0 md:pr-20 lg:pr-32"
              : "text-left pl-0 md:pl-20 lg:pl-32"
          } heroSectionLeft`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight heroSectionLeftTitle">
            {t("store.hero_title")}
          </h1>
          <p className="text-lg mb-8 max-w-lg heroSectionLeftText font-sukar">
            {t("store.hero_desc")}
          </p>
          <a
            href="#"
            className="underline text-primary-500 text-lg hover:text-primary-500 transition heroSectionLeftButton"
          >
            {t("store.hero_button")}
          </a>
        </div>
        {/* اليمين: سلايدر صور */}
        <div className="flex-1 flex flex-col items-center">
          <div className="embla overflow-hidden w-full" ref={emblaRef}>
            <div className="embla__container flex gap-6 md:gap-8">
              {sliderData.map((item, index) => (
                <div
                  key={index}
                  className="embla__slide flex-[0_0_80%] md:flex-[0_0_48%] min-w-0 relative rounded-lg shadow-sm"
                >
                  <div className="relative w-full h-[380px] md:h-[380px]  overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="pt-4 px-2 md:px-0">
                    <div
                      className="  text-base md:text-lg mb-1 line-clamp-2 font-bold font-sukar"
                      style={{ letterSpacing: "0.3px" }}
                    >
                      {item.title}
                    </div>
                    <div
                      className="mb-2 font-author font-sukar"
                      style={{ letterSpacing: "0.8px" }}
                    >
                      {t("store.crafted_by", { author: item.author })}
                    </div>
                    <div
                      className="text-base md:text-lg font-light mb-2"
                      style={{ letterSpacing: "1px" }}
                    >
                      {item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="flex w-full mt-6 gap-2">
            {sliderData.map((_, idx) => (
              <div
                key={idx}
                className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                  selectedIndex === idx
                    ? "bg-gray-650 dark:bg-gray-650 "
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
