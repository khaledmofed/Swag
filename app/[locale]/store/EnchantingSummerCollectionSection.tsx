"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import Link from "next/link";
import { ProductCard } from "@/components/common/ProductCard";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { useStoreHome } from "@/hooks/api";
import { getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function EnchantingSummerCollectionSection() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  // Fetch store home data with pagination
  const { data: storeHomeData, isLoading, isError } = useStoreHome(page);

  // Extract all products from the response
  const allProducts = storeHomeData?.data?.all_products?.data || [];
  const pagination = storeHomeData?.data?.all_products;
  const totalPages = pagination?.last_page || 1;

  // Display products for current page (8 products per page)
  const displayProducts = allProducts.slice(0, 8);
  console.log("displayProducts", displayProducts);

  // Handle product click
  const handleProductClick = (product: any) => {
    router.push(`/products/${product.id}`);
  };

  if (isLoading) {
    return (
      <section className="w-full bg-primary-50 dark:bg-secondary-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-primary-50 dark:bg-secondary-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="text-center text-red-600">
            حدث خطأ أثناء تحميل المنتجات
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-primary-50 dark:bg-secondary-600 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <h2 className="text-3xl md:text-5xl font-en font-light leading-tight">
            {t("summer_collection.title")}
          </h2>
          <Link
            href={`/${language}/all-categories`}
            className="flex items-center gap-2 text-base font-en text-gray-700 dark:text-gray-200 hover:text-primary-500 transition"
          >
            {t("summer_collection.explore")}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayProducts.map((product: any) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <ProductCard
                title={product.name}
                price={product.price} // سيتم استبداله بالسعر المحسوب
                image={getImageUrl(product.image)}
                id={product.id.toString()}
                isNew={product.featured === 1}
                slug={product.slug}
                karat={product.karat || undefined}
                metal={product.metal || undefined}
                weight={product.weight}
                manufacturingCost={Number(product.price) || 0}
              />
            </div>
          ))}
        </div>
        {/* Pagination */}
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

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  className={`w-8 h-8 flex items-center justify-center font-en text-[18px] transition dark:text-white ${
                    page === pageNum
                      ? "bg-gradient-to-b from-[#bfc7c3] to-[#7d8c86] text-white"
                      : "bg-transparent text-[#222] hover:text-primary-500 dark:text-white"
                  }`}
                  style={{ fontWeight: 400 }}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            )}

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

        {displayProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد منتجات متاحة
          </div>
        )}
      </div>
    </section>
  );
}
