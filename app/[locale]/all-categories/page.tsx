"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PaginationCustom } from "@/components/ui/PaginationCustom";
import { ContactUsBannerSection } from "../store/ContactUsBannerSection";
import Link from "next/link";
import { useCategoriesPaginated } from "@/hooks/api/useCategories";
import { getImageUrl } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";

export default function AllCategoriesPage() {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { initializeLanguageFromURL, language } = useLanguageStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize language from URL
      initializeLanguageFromURL();
    }
  }, [initializeLanguageFromURL]);

  // Fetch categories with pagination
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useCategoriesPaginated(page, {
    enabled: true,
  });

  // Extract categories and pagination data
  const categories = categoriesData?.items || [];
  const pagination = categoriesData?.pagination;
  const totalPages = pagination?.last_page || 1;
  const totalCategories = pagination?.total || 0;

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <section className="py-12 min-h-[70vh] bg-white-50 dark:bg-dark-secondary-600 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-0">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-10"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-none animate-pulse mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <ContactUsBannerSection />
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <section className="py-12 min-h-[70vh] bg-white-50 dark:bg-dark-secondary-600 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-0">
            <div className="text-center py-10">
              <p className="text-red-500 text-lg">
                {t("error.loading_categories") || "Error loading categories"}
              </p>
              <p className="text-gray-500 text-sm mt-2">{error.message}</p>
            </div>
          </div>
        </section>
        <ContactUsBannerSection />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-0 border-b border-gray-200 dark:border-color-dark">
        {/* Breadcrumb */}
        <nav
          className="flex items-center justify-center text-gray-400 text-md my-4 font-sukar"
          aria-label="Breadcrumb"
        >
          <a
            href={`/${language}/store`}
            className="hover:text-primary-500 transition"
          >
            {t("navigation.store")}
          </a>

          <span className="mx-2">&gt;</span>
          <span className="text-primary-600 font-semibold">
            {t("all_categories")}
          </span>
        </nav>
      </div>
      <section className=" min-h-[70vh] bg-white-50 dark:bg-dark-secondary-600 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10">
          <h1 className="text-3xl font-en font-light mb-2 capitalize">
            {t("all_categories") || "All Categories"}
          </h1>
          <div className="mb-10 text-gray-500 text-lg font-sukar">
            <span className="ml-1">{t("categories.description")}</span>
          </div>

          {categories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-full aspect-square rounded-none overflow-hidden bg-gradient-to-b from-[#f5f7f7] to-[#c7d6d6] dark:from-gray-800 dark:to-gray-900 flex items-center justify-center",
                        "shadow-sm"
                      )}
                    >
                      <Image
                        src={getImageUrl(cat.image)}
                        alt={cat.name}
                        width={320}
                        height={320}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="mt-4 text-lg font-sukar font-bold text-gray-800 dark:text-gray-100 text-center">
                      {cat.name}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationCustom
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                {t("no_categories_found") || "No categories found"}
              </p>
            </div>
          )}
        </div>
      </section>
      <ContactUsBannerSection />
    </MainLayout>
  );
}
