"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCategoriesStore } from "@/stores";
import { JewelryCard } from "@/components/common/JewelryCard";
import { PromoBanner } from "@/components/homePage/PromoBanner";
import { StoreHeroSection } from "./StoreHeroSection";
import { StunningCollectionsSection } from "./StunningCollectionsSection";
import { BreathtakingFormations } from "./BreathtakingFormations";
import { EnchantingSummerCollectionSection } from "./EnchantingSummerCollectionSection";
import { WhyChooseUsSection } from "./WhyChooseUsSection";
import { ContactUsBannerSection } from "./ContactUsBannerSection";
import { useLanguageStore } from "@/stores/languageStore";
import { useStoreHome } from "@/hooks/api";
import { getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function StorePage() {
  const { t } = useTranslation();
  const { categories } = useCategoriesStore();
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const { initializeLanguageFromURL } = useLanguageStore();
  const router = useRouter();

  // State للبحث والفلاتر
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [tokenReady, setTokenReady] = useState(false);

  // Fetch store home data
  const { data: storeHomeData, isLoading, isError } = useStoreHome();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setTokenReady(true);
      // Initialize language from URL
      initializeLanguageFromURL();
    }
  }, [initializeLanguageFromURL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Extract featured products from the response
  const featuredProducts = storeHomeData?.data?.featuredProducts || [];

  // Handle product click
  const handleProductClick = (product: any) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <MainLayout>
      <section className="py-2 border-b border-gray-200 dark:border-color-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          {/* قائمة الكاتيجوري النصية */}
          <div className="flex flex-wrap justify-center gap-20 py-6 categories-mobile ">
            {(categories || []).map((category) => (
              <a
                key={category.slug}
                href={`/category/${category.slug}`}
                className="text-lg font-medium text-secondary-500 hover:text-primary-500 transition-colors duration-200 dark:text-gray-200 dark:hover:text-primary-400"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </section>
      <StoreHeroSection />
      <StunningCollectionsSection />
      <BreathtakingFormations />
      <EnchantingSummerCollectionSection />
      <WhyChooseUsSection />
      <ContactUsBannerSection />
    </MainLayout>
  );
}
