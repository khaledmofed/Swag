"use client";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { MainLayout } from "@/components/layout/MainLayout";
import { DiscoverSection } from "@/components/homePage/DiscoverSection";
import { YouMayAlsoLikeSection } from "../products/YouMayAlsoLikeSection";
import { ProductBannerSection } from "../products/ProductBannerSection";
import { WhyChooseUsSection } from "../store/WhyChooseUsSection";
import { ContactUsBannerSection } from "../store/ContactUsBannerSection";
import { WhatWeOffer } from "@/components/homePage/WhatWeOffer";

export default function AboutPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  return (
    <MainLayout>
      <div className="container mx-auto py-0 border-b border-gray-200 dark:border-color-dark">
        {/* Breadcrumb */}
        <nav
          className="flex items-center justify-center text-gray-400 text-md my-4 font-sukar"
          aria-label="Breadcrumb"
        >
          <a href="/" className="hover:text-primary-500 transition">
            {t("navigation.home")}
          </a>
          <span className="mx-2">&gt;</span>
          <span className="text-primary-600 font-semibold">
            {t("about.title")}
          </span>
        </nav>
      </div>
      {/* Discover the Best Jewelry Section */}
      <DiscoverSection />
      <div
        className="bg-gradient-to-br from-[#e8e6e3] to-[#b7c7c7] font-sukar"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="container mx-auto py-16 px-4 flex flex-col items-center">
          {/* Hero Section */}

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[#607A76] font-sans">
            {t("about.title")}
          </h1>
          <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
            {t("about.subtitle")}
          </p>
          {/* Mission, Vision, Values */}
          <div className="grid md:grid-cols-3 gap-8 w-full mt-8">
            <div className="bg-white bg-opacity-80 rounded-lg shadow p-6 flex flex-col items-center">
              <h2 className="text-xl font-bold text-[#607A76] mb-2">
                {t("about.mission_title")}
              </h2>
              <p className="text-gray-700 text-center">{t("about.mission")}</p>
            </div>
            <div className="bg-white bg-opacity-80 rounded-lg shadow p-6 flex flex-col items-center">
              <h2 className="text-xl font-bold text-[#607A76] mb-2">
                {t("about.vision_title")}
              </h2>
              <p className="text-gray-700 text-center">{t("about.vision")}</p>
            </div>
            <div className="bg-white bg-opacity-80 rounded-lg shadow p-6 flex flex-col items-center">
              <h2 className="text-xl font-bold text-[#607A76] mb-2">
                {t("about.values_title")}
              </h2>
              <p className="text-gray-700 text-center">{t("about.values")}</p>
            </div>
          </div>
        </div>
      </div>
      {/* What We Offer Services Section */}
      <WhatWeOffer />
      <ProductBannerSection />
      <WhyChooseUsSection />
      <ContactUsBannerSection />
    </MainLayout>
  );
}
