"use client";

import { useTranslation } from "react-i18next";
import { JewelryCard } from "@/components/common/JewelryCard";
import { useCategoriesStore, useSystemSettingsStore } from "@/stores";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function BreathtakingFormations() {
  const { t } = useTranslation();
  const { getSettingValue } = useSystemSettingsStore();
  const { categories } = useCategoriesStore();
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const collections = (categories || []).map((category) => {
    return {
      id: category.id,
      description: category.description,
      key: category.slug,
      title: category.name,
      image: category.image || "",
    };
  });

  const handleCollectionClick = (collectionKey: string) => {
    router.push(`/category/${collectionKey}`);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* Section Title */}
          <p className="text-primary-500 text-lg capitalize tracking-wider mb-2">
            {t("store.breathtaking_formations.subtitle")}
          </p>

          {/* Main Title */}
          <h2 className="text-3xl md:text-6xl text-secondary-500 dark:text-white-500">
            {t("store.breathtaking_formations.title")}
          </h2>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {collections.map((collection) => (
            <JewelryCard
              key={collection.key}
              title={collection.title}
              image={collection.image}
              onClick={() => handleCollectionClick(collection.key)}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
