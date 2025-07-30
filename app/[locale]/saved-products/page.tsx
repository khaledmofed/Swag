"use client";
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AccountSidebar } from "@/components/common/AccountSidebar";
import { ProductCard } from "@/components/common/ProductCard";
import { useRouter } from "next/navigation";
import { ContactUsBannerSection } from "../store/ContactUsBannerSection";
import { useFavorites, useToggleFavorite } from "@/hooks/api";
import { useUserStore } from "@/stores/userStore";
import { useTranslation } from "react-i18next";

export default function SavedProductsPage() {
  const { token, profile, setProfile, setToken } = useUserStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem("token");
      if (storedToken && setToken) setToken(storedToken);
    }
    if (!profile) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setProfile(JSON.parse(storedUser));
    }
  }, [token, profile, setProfile, setToken]);

  const [page, setPage] = useState(1);
  const perPage = 8;
  const router = useRouter();

  // جلب المفضلة من API
  const { data: favData, isLoading, isError, refetch } = useFavorites();
  console.log("favData", favData);

  // إضافة/حذف من المفضلة
  const toggleFavMutation = useToggleFavorite();

  const handleSidebarMenuClick = (label: string) => {
    if (label === "Profile") router.push("/profile");
    else if (label === "View Saved Products") router.push("/saved-products");
    else if (label === "Orders") router.push("/orders");
    else if (label === "Addresses") router.push("/addresses");
    // else if (label === "Change Password") router.push("/change-password");
    // Logout can be handled here
  };

  // Pagination logic
  const totalPages = Math.ceil(
    (favData?.data?.favorite?.length || 0) / perPage
  );
  const paginated =
    favData?.data?.favorite?.slice((page - 1) * perPage, page * perPage) || [];

  // إعادة تعيين الصفحة إلى 1 عند تغيير البيانات
  useEffect(() => {
    if (favData?.data?.favorite && page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [favData?.data?.favorite, page, totalPages]);
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] dark:bg-[#181e1e] font-sukar">
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10 flex flex-col md:flex-row gap-8">
          <AccountSidebar
            activeItem="View Saved Products"
            onMenuClick={handleSidebarMenuClick}
          />
          <main className="flex-1 bg-white dark:bg-[#2c2c2c] rounded-none border border-gray-200 dark:border-[#353535] p-8">
            <h1 className="text-2xl font-bold text-[#607A76] font-sukar">
              {t("saved_products.title")}
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              {t("saved_products.subtitle")}
            </p>
            {!token ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-6">
                <div className="flex-2 flex flex-col items-start justify-center">
                  <h1
                    className="text-3xl md:text-4xl font-sukar font-bold mb-4"
                    style={{ lineHeight: "30px" }}
                  >
                    {t("saved_products.login_empty_title")}
                  </h1>
                  <p
                    className="text-lg font-sukar text-[#607A76] font-semibold mb-6"
                    style={{ lineHeight: "22px" }}
                  >
                    {t("saved_products.login_empty_desc")}
                  </p>
                  <button
                    className="flex-1 h-12 px-6 py-2 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
                    onClick={() => router.push("/store")}
                  >
                    {t("saved_products.discover_now")}
                  </button>
                </div>
                <div className="flex-2 flex items-center justify-end">
                  <img
                    src="/images/empty-favorites.png"
                    alt="Empty cart"
                    className="w-100 select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>
            ) : isLoading ? (
              <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-8 w-48 bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>
                </div>
                {/* Products Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-[#232b2b] border border-gray-200 dark:border-[#353535] rounded-none p-0"
                    >
                      {/* Image Skeleton */}
                      <div className="w-full h-48 bg-gray-200 dark:bg-[#353535] rounded animate-pulse mb-4"></div>
                      {/* Title Skeleton */}
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-[#353535] rounded animate-pulse mb-2"></div>
                      {/* Price Skeleton */}
                      <div className="h-4 w-1/2 bg-gray-200 dark:bg-[#353535] rounded animate-pulse mb-2"></div>
                      {/* Button Skeleton */}
                      <div className="h-8 w-full bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : isError ? (
              <div className="text-center text-red-600 py-20">
                {t("saved_products.error_loading")}
              </div>
            ) : favData?.data?.favorite?.length === 0 ? (
              <>
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-6">
                  <div className="flex-2 flex flex-col items-start justify-center">
                    <h1
                      className="text-3xl md:text-4xl font-sukar font-bold mb-4"
                      style={{ lineHeight: "30px" }}
                    >
                      {t("saved_products.empty_title")}
                    </h1>
                    <p
                      className="text-lg font-sukar text-[#607A76] font-semibold mb-6"
                      style={{ lineHeight: "22px" }}
                    >
                      {t("saved_products.empty_desc")}
                    </p>
                    <button
                      className="flex-1 h-12 px-6 py-2 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
                      onClick={() => router.push("/store")}
                    >
                      {t("saved_products.discover_now")}
                    </button>
                  </div>
                  <div className="flex-2 flex items-center justify-end">
                    <img
                      src="/images/empty-favorites.png"
                      alt="Empty cart"
                      className="w-100 select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 saved-products-grid-zoom-88">
                  {
                    paginated
                      .map((favoriteItem: any, idx: number) => {
                        // استخراج بيانات المنتج من داخل favoriteItem.product
                        const product = favoriteItem.product;

                        // التحقق من وجود بيانات المنتج
                        if (!product) {
                          console.warn(
                            "Product data missing for favorite item:",
                            favoriteItem
                          );
                          return null;
                        }

                        return (
                          <ProductCard
                            id={product.id.toString()}
                            key={favoriteItem.id || idx}
                            title={
                              product.name || product.title || "Product Name"
                            }
                            price={`${product.price || "0"} ${
                              product.currency || "USD"
                            }`}
                            image={product.image || ""}
                            slug={product.slug || ""}
                          />
                        );
                      })
                      .filter(Boolean) // إزالة العناصر الفارغة
                  }
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 rounded bg-gray-100 dark:bg-[#232b2b] text-gray-700 dark:text-white font-bold disabled:opacity-50"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        &lt;
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          className={`px-3 py-1 rounded font-bold ${
                            page === i + 1
                              ? "bg-[#607A76] text-white"
                              : "bg-gray-100 dark:bg-[#232b2b] text-gray-700 dark:text-white"
                          }`}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className="px-3 py-1 rounded bg-gray-100 dark:bg-[#232b2b] text-gray-700 dark:text-white font-bold disabled:opacity-50"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                      >
                        &gt;
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
        <ContactUsBannerSection />
      </MainLayout>
    </div>
  );
}
