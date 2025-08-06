"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/stores";
import { Icon } from "@/components/common/Icon";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useStoreHome, StoreHomeCollection } from "@/hooks/api";
import { getImageUrl } from "@/lib/utils";
import { useSocketPricing } from "@/hooks/useSocketPricing";

const sidebarLinks = [
  { label: "sidebar_1", href: "#" },
  { label: "sidebar_2", href: "#" },
  { label: "sidebar_3", href: "#" },
];

export function StunningCollectionsHeaderSection() {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const router = useRouter();

  return (
    <section className="w-full bg-primary-50  dark:bg-secondary-600 pt-16 pb-8 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Title & Description */}
        <div className="flex-1 min-w-0">
          <h2 className="text-4xl md:text-5xl font-light mb-4 leading-tight font-en">
            {t("stunning_collections.title")}
          </h2>
          <p
            className="text-lg mb-8 max-w-2xl font-sukar text-gray-700 dark:text-gray-200"
            style={{ letterSpacing: "0.5px" }}
          >
            {t("stunning_collections.desc")}
          </p>
        </div>
        {/* Right: Sidebar Links & Button */}
        <aside className="w-full md:w-80 flex flex-col gap-4 md:items-end">
          <nav
            className="flex flex-col gap-2 mb-6 md:mb-8"
            style={{ letterSpacing: "1px" }}
          >
            {sidebarLinks.map((link, idx) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-base font-en  dark:text-gray-200 hover:text-primary-500 transition flex items-center gap-2"
              >
                {t(`stunning_collections.${link.label}`)}
                <span className="text-lg iconeBehind">
                  <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={16} />
                </span>
              </Link>
            ))}
          </nav>
          <div className="text-end">
            <Button
              type="button"
              variant="gradient"
              className="  font-sukar px-5 py-3 text-md font-semibold transition-colors duration-200 flex items-center gap-2"
              onClick={() => router.push("/all-categories")}
            >
              {t("stunning_collections.button")}
              <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={16} />
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function StunningCollectionsGridSection() {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const { language } = useLanguageStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0); // Default to first collection

  // Fetch store home data
  const { data: storeHomeData, isLoading, isError } = useStoreHome();

  // استخدام هوك Socket للأسعار المباشرة
  const { priceUpdates, broadcastData } = useSocketPricing();

  // دالة حساب السعر المباشر للمنتج مع مذكرة للأداء
  const calculateLivePrice = useMemo(() => {
    return (product: any): string => {
      if (
        !product.karat ||
        !product.metal ||
        !product.weight ||
        !product.price
      ) {
        return `${product.price} ${product.currency}`;
      }

      // تحديد اسم السعر في Socket
      let socketPriceName = "";
      if (product.metal.toLowerCase() === "gold") {
        socketPriceName = `gold-price-region${product.karat}`;
      } else if (product.metal.toLowerCase() === "silver") {
        socketPriceName = "silversounces";
      } else {
        return `${product.price} ${product.currency}`;
      }

      // الحصول على سعر البورصة من priceUpdates أولاً
      let exchangeRate = null;
      const latestUpdate = priceUpdates.find(
        (update) => update.priceName === socketPriceName
      );

      if (latestUpdate) {
        exchangeRate = latestUpdate.newPrice;
      } else if (broadcastData && broadcastData[socketPriceName]) {
        exchangeRate = broadcastData[socketPriceName];
      }

      if (!exchangeRate && exchangeRate !== 0) {
        return `${product.price} ${product.currency}`;
      }

      // حساب السعر: (سعر البورصة + سعر المصنعية) × الوزن
      const manufacturingCost = Number(product.price) || 0;
      const totalPrice = (exchangeRate + manufacturingCost) * product.weight;

      return totalPrice.toLocaleString("en-US", { maximumFractionDigits: 2 });
    };
  }, [priceUpdates, broadcastData]);

  // Extract collections and create tabs
  const collections = storeHomeData?.data?.collections || {};
  const collectionEntries = Object.entries(collections);

  // Create tabs from collections
  const tabs = [
    { label: "all", id: "all", name: "الكل" },
    ...collectionEntries.map(([key, collection]) => ({
      label: collection.slug,
      id: key,
      name:
        collection.name[language as keyof typeof collection.name] ||
        collection.name.en,
    })),
  ];

  // Get products for active tab
  const getProductsForTab = () => {
    if (activeTab === 0) {
      // Show all products from all collections
      return collectionEntries.flatMap(
        ([_, collection]) => collection.products
      );
    }

    const activeCollection = collectionEntries[activeTab - 1];
    return activeCollection ? activeCollection[1].products : [];
  };

  const currentProducts = getProductsForTab();

  // Handle product click
  const handleProductClick = (product: any) => {
    router.push(`/products/${product.id}`);
  };

  if (isLoading) {
    return (
      <section className="w-full bg-primary-50 dark:bg-secondary-600 pt-0 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="text-center">جاري تحميل المجموعات...</div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-primary-50 dark:bg-secondary-600 pt-0 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="text-center text-red-600">
            حدث خطأ أثناء تحميل المجموعات
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-primary-50 dark:bg-secondary-600 pt-0 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Tabs */}
        <div className="collections-tabs-mobile flex flex-wrap gap-4 mb-0  border-gray-200 dark:border-gray-700 pb-4">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              className={`pb-2 px-4 text-base sm:text-lg font-sukar tracking-wide transition-colors duration-200 relative ${
                activeTab === idx
                  ? "text-primary-500 font-bold border-b-2 border-primary-500 active"
                  : "text-gray-700 dark:text-gray-300 hover:text-primary-500"
              } bg-transparent outline-none`}
              onClick={() => setActiveTab(idx)}
            >
              {tab.id === "all" ? t("stunning_collections.tabs.all") : tab.name}
            </button>
          ))}
        </div>
        {/* Main grid: 2 columns (left: 2x2 grid, right: big card) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Left: 2x2 grid for products */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {currentProducts.slice(0, 4).map((product: any, idx: number) => (
              <div
                key={product.id}
                className="relative flex flex-col justify-end overflow-hidden bg-gradient-to-b from-[#f5f7f7] to-[#c7d6d6] dark:from-gray-800 dark:to-gray-900 h-[360px] md:h-[360px] px-6 pt-8 pb-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleProductClick(product)}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                  style={{
                    backgroundImage: `url(${getImageUrl(product.image)})`,
                  }}
                />
                {/* Content above background */}
                <div className="relative z-10 flex flex-col justify-end h-full">
                  <div className="flex-1" />
                  <div className="w-full mt-6 flex items-center justify-between">
                    <div>
                      <div
                        className="font-sukar text-lg font-bold mb-1 dark:text-gray-100"
                        style={{ letterSpacing: "0.3px", color: "#5C5C5C" }}
                      >
                        {product.name}
                      </div>
                      <div
                        className="text-md font-bold flex items-center gap-1"
                        style={{ color: "#607A76", letterSpacing: "0.5px" }}
                      >
                        {calculateLivePrice(product)}
                        <svg
                          id="Layer_1"
                          className="inline-block fill-current customeSize"
                          width="14"
                          height="14"
                          data-name="Layer 1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1124.14 1256.39"
                        >
                          <path
                            className="cls-1"
                            d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
                          ></path>
                          <path
                            className="cls-1"
                            d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
                          ></path>
                        </svg>
                        {calculateLivePrice(product) !==
                          `${product.price} ${product.currency}` && (
                          <span className="text-xs text-green-600 ml-1 font-bold">
                            LIVE
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className="inline-block text-lg align-middle"
                      style={{ color: "#607A76" }}
                    >
                      <Icon
                        name={isRTL ? "arrow-left" : "arrow-right"}
                        size={20}
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Right: Big Collection Card */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-[#e6ecec] to-[#b7c7c7] dark:from-gray-800 dark:to-gray-900  h-full min-h-[600px] relative overflow-hidden">
            {/* Background image */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
              style={{
                backgroundImage: "url(/images/collections/rings-hero.png)",
              }}
            />
            {/* Content above background */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span
                className="font-en text-3xl text-gray-700 dark:text-gray-200 text-center"
                style={{
                  width: "50%",
                  letterSpacing: "0.5px",
                  color: "#5C5C5C",
                  fontSize: "40px",
                }}
              >
                {t("stunning_collections.view_rings")}
              </span>
            </div>
          </div>
        </div>
        {/* Big Collection Image for mobile (below grid) */}
        <div className="md:hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#e6ecec] to-[#b7c7c7] dark:from-gray-800 dark:to-gray-900 rounded-none h-[340px] mt-6 relative overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
            style={{
              backgroundImage: "url(/images/collections/rings-hero.png)",
            }}
          />
          {/* Content above background */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <span
              className="font-en text-2xl text-gray-700 dark:text-gray-200 mb-2 text-center"
              style={{ width: "50%" }}
            >
              {t("stunning_collections.view_rings")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main section for import convenience
export function StunningCollectionsSection() {
  return (
    <>
      <StunningCollectionsHeaderSection />
      <StunningCollectionsGridSection />
    </>
  );
}
