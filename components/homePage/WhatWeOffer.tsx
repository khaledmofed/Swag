"use client";

import { useTranslation } from "react-i18next";
import { ServiceCard } from "@/components/common/ServiceCard";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import {
  useSystemSettingsWithStore,
  useActiveServicesWithStore,
} from "@/hooks";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/stores";
import { useState, useEffect } from "react";

export function WhatWeOffer() {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { getSettingByKey } = useSystemSettingsWithStore({
    enabled: isClient,
  });
  const { data: activeServices = [], isLoading } = useActiveServicesWithStore({
    enabled: isClient,
  });

  const services = activeServices.map((service) => ({
    key: service.slug,
    title: service.name,
    description: service.description,
    image: service.image || "",
  }));

  // Don't render during SSR or while loading
  if (!isClient || isLoading) {
    return (
      <></>
      // <section className="py-8 lg:py-24 bg-white dark:bg-secondary-600 transition-colors duration-300">
      //   <div className="container mx-auto px-4 sm:px-6 lg:px-0">
      //     <div className="animate-pulse space-y-8">
      //       <div className="text-center">
      //         <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
      //         <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
      //         <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      //       </div>
      //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      //         {[...Array(4)].map((_, i) => (
      //           <div key={i} className="h-48 bg-gray-200 rounded"></div>
      //         ))}
      //       </div>
      //     </div>
      //   </div>
      // </section>
    );
  }

  const handleServiceClick = (serviceKey: string) => {
    console.log(`Clicked on ${serviceKey} service`);
  };

  const handleShowMoreProducts = () => {
    router.push(getSettingByKey("WHAT_WE_OFFER_CTA_URL")?.value || "/");
  };

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        <h2 className="text-base sm:text-lg font-bold text-primary-500 mb-3 sm:mb-4">
          {getSettingByKey("WHAT_WE_OFFER_CAPTION")?.value ||
            t("services.services")}
        </h2>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-8">
          <div className="text-start mb-6 lg:mb-12 flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-secondary-500 dark:text-white-500 mb-3 sm:mb-4">
              {getSettingByKey("WHAT_WE_OFFER_HEADING")?.value ||
                t("services.title")}
            </h2>
            <p className="text-base sm:text-lg text-secondary-500 dark:text-white-500 max-w-2xl">
              {getSettingByKey("WHAT_WE_OFFER_RICH_TEXT")?.value ||
                t("services.subtitle")}
            </p>
          </div>
          <div className="text-start lg:text-end w-full lg:w-auto">
            <Button
              type="button"
              variant="gradient"
              onClick={handleShowMoreProducts}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 font-medium transition-colors duration-200 flex items-center gap-2"
            >
              {getSettingByKey("WHAT_WE_OFFER_CTA_TEXT")?.value ||
                t("services.show_more_products")}
              <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={16} />
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {services.map((service) => (
            <ServiceCard
              key={service.key}
              title={service.title}
              description={service.description}
              image={service.image}
              onClick={() => handleServiceClick(service.key)}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
