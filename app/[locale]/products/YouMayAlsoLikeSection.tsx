"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import Link from "next/link";
import { ProductCard } from "@/components/common/ProductCard";
import { getImageUrl } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languageStore";

interface Product {
  id: number;
  category_id: number;
  slug: string;
  image: string;
  short_description_en: string;
  old_price: string;
  price: string;
  currency: string;
  reviews_count: number;
  rating: string;
  status: number;
  created_at: string;
  updated_at: string;
  featured: number;
  karat: string | null;
  gender: string | null;
  metal: string | null;
  weight?: number; // إضافة الوزن
  name: string;
  short_description: string;
  description: string;
}

interface YouMayAlsoLikeSectionProps {
  relatedProducts?: Product[];
}

export function YouMayAlsoLikeSection({
  relatedProducts = [],
}: YouMayAlsoLikeSectionProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [hovered, setHovered] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  // If no related products, show empty state
  if (!relatedProducts || relatedProducts.length === 0) {
    return (
      <section className="w-full bg-primary-50 dark:bg-secondary-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="text-center py-10">
            <h2 className="text-3xl font-en font-bold mb-2">
              {t("related_products.title")}
            </h2>
            <p className="text-gray-500 text-lg">
              {t("related_products.no_products")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Pagination logic for related products
  const itemsPerPage = 8;
  const totalPages = Math.ceil(relatedProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = relatedProducts.slice(startIndex, endIndex);

  return (
    <section className="w-full bg-primary-50 dark:bg-secondary-600 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div className="text-start mb-0">
            {" "}
            <h2 className="text-3xl font-en font-bold mb-2">
              {t("related_products.title")}
            </h2>
            <p className="text-lg mb-0 max-w-lg font-sukar">
              {t("related_products.subtitle")}
            </p>
          </div>
          <Link
            href={`/${language}/all-categories`}
            className="flex items-center gap-2 text-base font-en text-gray-700 dark:text-gray-200 hover:text-primary-500 transition"
          >
            {t("related_products.explore_collection")}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              price={product.price} // سيتم استبداله بالسعر المحسوب
              image={getImageUrl(product.image)}
              isNew={product.featured === 1}
              slug={product.slug}
              id={product.id.toString()}
              karat={product.karat || undefined}
              metal={product.metal || undefined}
              weight={product.weight}
              manufacturingCost={Number(product.price) || 0}
            />
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-center gap-0 mt-10">
            <div className="flex items-center justify-center gap-4">
              <button
                className="w-8 h-8 flex items-center justify-center text-[18px] font-en transition dark:text-white"
                style={{ color: page === 1 ? "#d1d5db" : "#bfc7c3" }}
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <Icon name="arrow-left" size={22} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 flex items-center justify-center font-en text-[18px] transition dark:text-white ${
                    page === p
                      ? "bg-gradient-to-b from-[#bfc7c3] to-[#7d8c86] text-white"
                      : "bg-transparent text-[#222] hover:text-primary-500 dark:text-white"
                  }`}
                  style={page === p ? { fontWeight: 400 } : { fontWeight: 400 }}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="w-8 h-8 flex items-center justify-center text-[18px] font-en transition dark:text-white"
                style={{ color: page === totalPages ? "#d1d5db" : "#bfc7c3" }}
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <Icon name="arrow-right" size={22} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
