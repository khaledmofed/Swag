"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { WhyChooseUsSection } from "../../store/WhyChooseUsSection";
import { ContactUsBannerSection } from "../../store/ContactUsBannerSection";
import { YouMayAlsoLikeSection } from "../YouMayAlsoLikeSection";
import { ProductBannerSection } from "../ProductBannerSection";
import { ProductShareSidebar } from "../ProductShareSidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getImageUrl } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languageStore";
import { useProductDetails } from "@/hooks/api/useProductDetails";
import { useCategoryById } from "@/hooks/api/useCategories";
import {
  useFavorites,
  useToggleFavorite,
  useAddToCart,
  useCart,
  useRemoveFromCart,
} from "@/hooks/api";
import { useUserStore } from "@/stores/userStore";
import { useToastStore } from "@/stores/toastStore";
import { useTranslation } from "react-i18next";

const BASE_URL = "https://swag.ivadso.com";

export default function ProductDetailsPage() {
  const { slug } = useParams(); // This is now the product ID
  const { language } = useLanguageStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { token } = useUserStore();
  const { showToast: showToastMessage } = useToastStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Fetch product details using the product ID directly
  const {
    data: productResponse,
    isLoading,
    isError,
    error,
  } = useProductDetails(slug as string, {
    enabled: !!slug,
  });

  console.log("=== PRODUCT PAGE DEBUG ===");
  console.log("URL slug (product ID):", slug);
  console.log("productResponse:", productResponse);
  console.log("isLoading:", isLoading);
  console.log("isError:", isError);
  console.log("error:", error);

  const product = productResponse?.data?.product;
  console.log("product:", product);

  const relatedProducts = productResponse?.data?.related?.data || [];

  // Fetch category information if we have a product
  const { data: categoryData } = useCategoryById(product?.category_id || 0, {
    enabled: !!product?.category_id,
  });

  console.log("categoryData:", categoryData);
  console.log("product?.category_id:", product?.category_id);

  // جلب المفضلة من API
  const { data: favData } = useFavorites();

  // إضافة/حذف من المفضلة
  const toggleFavourite = useToggleFavorite();

  // إضافة للسلة
  const addToCartMutation = useAddToCart();

  // حذف من السلة
  const removeFromCartMutation = useRemoveFromCart();

  // جلب بيانات السلة
  const { data: cartData } = useCart();

  // حالة المنتج في السلة
  const [isInCart, setIsInCart] = useState(false);

  // Check if product is saved and in cart on mount and when slug changes
  useEffect(() => {
    if (!slug) return;

    // إذا لم يكن هناك توكن، تأكد من أن المنتج غير محفوظ
    if (!token) {
      setIsSaved(false);
      setIsInCart(false);
      return;
    }

    if (!favData?.data?.favorite) return;

    setIsSaved(
      favData.data.favorite.some((p: any) => p.product_id === Number(slug))
    );

    // التحقق من وجود المنتج في السلة
    const inCart =
      cartData?.data?.cart?.some(
        (item: any) => item.product_id === Number(slug)
      ) || false;

    console.log("Product in cart:", inCart);
    setIsInCart(inCart);
  }, [slug, favData?.data?.favorite, cartData?.data?.cart, token]);

  // مستمع لحدث تسجيل الخروج
  useEffect(() => {
    const handleLogout = () => {
      console.log(
        "ProductDetailsPage - Logout detected, setting isSaved to false"
      );
      setIsSaved(false);
    };

    const handleLogin = () => {
      console.log("ProductDetailsPage - Login detected, will check favorites");
      // سيتم التحقق من المفضلة تلقائياً عند تغيير token
    };

    window.addEventListener("user-logged-out", handleLogout);
    window.addEventListener("user-logged-in", handleLogin);

    return () => {
      window.removeEventListener("user-logged-out", handleLogout);
      window.removeEventListener("user-logged-in", handleLogin);
    };
  }, []);

  // مستمع لحدث تسجيل الخروج للسلة
  useEffect(() => {
    const handleLogout = () => {
      console.log("ProductDetailsPage - Logout detected for cart");
    };

    const handleLogin = () => {
      console.log("ProductDetailsPage - Login detected for cart");
    };

    window.addEventListener("user-logged-out", handleLogout);
    window.addEventListener("user-logged-in", handleLogin);

    return () => {
      window.removeEventListener("user-logged-out", handleLogout);
      window.removeEventListener("user-logged-in", handleLogin);
    };
  }, []);

  const handleAddToCart = () => {
    if (typeof window === "undefined" || !product) return;

    // التحقق من تسجيل الدخول
    if (!token) {
      showToastMessage(t("toast.login_required"));
      return;
    }

    if (isInCart) {
      // حذف من السلة
      removeFromCartMutation.mutate(Number(product.id), {
        onSuccess: (data) => {
          console.log("Remove from cart response:", data);
          showToastMessage(data?.msg || t("toast.product_removed"));
          setAdded(false);
        },
        onError: (error) => {
          console.log("Remove from cart error:", error);
          showToastMessage(t("toast.remove_failed"));
        },
      });
    } else {
      // إضافة للسلة
      addToCartMutation.mutate(
        { productId: Number(product.id), quantity: quantity },
        {
          onSuccess: (data) => {
            console.log("Add to cart response:", data);
            showToastMessage(data?.msg || t("toast.cart_updated"));
            setAdded(true);
          },
          onError: (error) => {
            console.log("Add to cart error:", error);
            showToastMessage(t("toast.cart_update_failed"));
          },
        }
      );
    }
  };

  const handleToggleFavorite = () => {
    if (!slug || !product) return;

    // التحقق من تسجيل الدخول
    if (!token) {
      showToastMessage(t("toast.login_required"));
      return;
    }

    toggleFavourite.mutate(Number(slug), {
      onSuccess: (data) => {
        console.log("Toggle favorite response:", data);
        // عرض رسالة النجاح من الـ API
        const successMessage = isSaved
          ? t("toast.favorite_removed")
          : t("toast.favorite_added");
        showToastMessage(data?.msg || successMessage);

        // تحديث عدد المفضلة في الهيدر مباشرة
        const currentFavorites = favData?.data?.favorite || [];
        const newCount = isSaved
          ? currentFavorites.length - 1
          : currentFavorites.length + 1;

        // إرسال البيانات الجديدة مع الـ event
        window.dispatchEvent(
          new CustomEvent("saved-products-updated", {
            detail: { count: newCount },
          })
        );
      },
      onError: (error) => {
        console.log("Toggle favorite error:", error);
        // عرض رسالة الخطأ
        showToastMessage(t("toast.cart_update_failed"));
      },
    });
  };

  useEffect(() => {
    setAdded(false);
  }, [quantity]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !product) {
    return (
      <MainLayout>
        <div className="text-center py-20 text-xl">
          <div className="text-red-600 mb-4">
            حدث خطأ أثناء جلب بيانات المنتج
          </div>
          {error && (
            <div className="text-gray-500 text-sm">
              {error instanceof Error ? error.message : String(error)}
            </div>
          )}
          <div className="mt-4">
            <a
              href="/store"
              className="text-primary-500 hover:text-primary-600 underline"
            >
              العودة إلى المتجر
            </a>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ProductShareSidebar
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={typeof window !== "undefined" ? window.location.href : ""}
        product={{
          image: getImageUrl(product.image),
          title: product.name,
          rating: parseFloat(product.rating),
          reviews: product.reviews_count,
          description: product.description,
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-0 border-b border-gray-200 dark:border-color-dark">
        {/* Breadcrumb */}
        <nav
          className="flex items-center justify-center text-gray-400 text-md my-4 font-sukar"
          aria-label="Breadcrumb"
        >
          <a href="/store" className="hover:text-primary-500 transition">
            Store
          </a>
          <span className="mx-2">&gt;</span>
          <a
            href="/all-categories"
            className="hover:text-primary-500 transition"
          >
            Categories
          </a>
          <span className="mx-2">&gt;</span>
          <a
            href={`/category/${categoryData?.slug}`}
            className="hover:text-primary-500 transition"
          >
            {categoryData?.name}
          </a>
          <span className="mx-2">&gt;</span>
          <span className="text-primary-600 font-semibold">{product.name}</span>
        </nav>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Gallery */}
          <div className="flex-1 flex flex-col gap-2 max-w-xl">
            {/* Thumbnail Images */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {/* Main Image Thumbnail */}
              <div
                className={`aspect-square bg-gray-50 flex items-center justify-center cursor-pointer border-2 ${
                  selectedImage === 0
                    ? "border-primary-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(0)}
              >
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Additional Images Thumbnails */}
              {product.images &&
                product.images.length > 0 &&
                product.images.map((image: any, index: number) => (
                  <div
                    key={image.id}
                    className={`aspect-square bg-gray-50 flex items-center justify-center cursor-pointer border-2 ${
                      selectedImage === index + 1
                        ? "border-primary-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index + 1)}
                  >
                    <img
                      src={getImageUrl(image.image)}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
            </div>
            {/* Main Image Display */}
            <div className="aspect-square bg-gray-50 flex items-center justify-center border border-gray-200">
              <img
                src={
                  selectedImage === 0
                    ? getImageUrl(product.image)
                    : product.images && product.images[selectedImage - 1]
                    ? getImageUrl(product.images[selectedImage - 1].image)
                    : getImageUrl(product.image)
                }
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col gap-2 md:gap-2">
            <div className="flex items-start justify-between w-full">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-5xl font-bold font-sukar text-gray-900 dark:text-white-50 mb-2 leading-tight">
                    {product.name}
                  </h1>
                </div>
              </div>
              <button
                className="p-2 rounded-none border border-gray-200 hover:bg-gray-50 transition"
                title="Share"
                onClick={() => setShareOpen(true)}
              >
                <Icon name="share" size={22} className="text-gray-400" />
              </button>
            </div>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-1 font-sukar">
              {/* Stars */}
              {Array.from({
                length: Math.floor(parseFloat(product.rating) || 0),
              }).map((_, i) => (
                <Icon
                  key={i}
                  name="star"
                  size={22}
                  className="text-yellow-400"
                />
              ))}
              {/* <span className="ml-2 text-gray-700 dark:text-gray-200 text-base font-sukar">
                {product.reviews_count || 0} Review
              </span> */}
            </div>
            {/* Price */}
            <div className="flex flex-col gap-2 mt-2 mb-1">
              {/* Final Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold text-[#607A76] font-sukar">
                  {product.final_price || product.price}{" "}
                  <svg
                    id="Layer_1"
                    className="inline-block fill-primary-607a76 customeSize"
                    width="24"
                    height="24"
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
                  </svg>{" "}
                </span>
              </div>

              {/* Manufacturing Cost per Gram */}
              {product.price && (
                <div className="flex items-center gap-2">
                  <span className="text-base text-gray-400 font-sukar">
                    {t("product_details.manufacturing_cost_per_gram")}:
                  </span>
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-300 font-sukar">
                    {product.price}{" "}
                    <svg
                      id="Layer_1"
                      className="inline-block fill-primary-607a76 customeSize"
                      width="16"
                      height="16"
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
                    | {t("product_details.grams")}
                  </span>
                </div>
              )}
            </div>

            {/* Old Price and Tax Info */}
            <div className="flex items-baseline gap-2">
              {product.old_price && product.old_price !== product.price && (
                <span className="text-base text-gray-400 font-sukar ml-2 line-through">
                  {product.old_price}{" "}
                  <svg
                    id="Layer_1"
                    className="inline-block fill-gray-400 customeSize"
                    width="18"
                    height="18"
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
                  </svg>{" "}
                </span>
              )}
              {/* <span className="text-base text-gray-400 font-sukar ml-2">
                Tax Included
              </span> */}
            </div>
            {/* Description */}
            <div
              className="text-gray-700 dark:text-gray-200 text-lg font-sukar leading-relaxed mb-4 prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Product Specifications */}
            <div className="rounded-none mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-sukar flex items-center gap-2">
                {/* <Icon name="eye" size={20} className="text-[#607A76]" /> */}
                {t("product_details.specifications")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {product.karat && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-none dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300 font-sukar flex items-center gap-2">
                      {t("product_details.karat")}:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-sukar">
                      {product.karat}K
                    </span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-none dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300 font-sukar flex items-center gap-2">
                      {t("product_details.weight")}:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-sukar">
                      {product.weight} {t("product_details.grams")}
                    </span>
                  </div>
                )}
                {product.metal && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-none dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300 font-sukar flex items-center gap-2">
                      {t("product_details.metal")}:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-sukar capitalize">
                      {product.metal}
                    </span>
                  </div>
                )}
                {product.color && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-none dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300 font-sukar flex items-center gap-2">
                      {t("product_details.color")}:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-sukar capitalize">
                      {product.color}
                    </span>
                  </div>
                )}
                {product.gender && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-none dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300 font-sukar flex items-center gap-2">
                      {t("product_details.gender")}:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-sukar capitalize">
                      {product.gender === "womens"
                        ? t("product_details.womens")
                        : product.gender === "mens"
                        ? t("product_details.mens")
                        : product.gender}
                    </span>
                  </div>
                )}
                {product.availability && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-none dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300 font-sukar flex items-center gap-2">
                      {t("product_details.availability")}:
                    </span>
                    <span
                      className={`font-bold font-sukar ${
                        product.availability === "1"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {product.availability === "1"
                        ? t("product_details.available")
                        : t("product_details.not_available")}
                    </span>
                  </div>
                )}
                {product.occasion && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300 font-sukar">
                      {t("product_details.occasion")}:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-sukar capitalize">
                      {product.occasion}
                    </span>
                  </div>
                )}
                {product.items_no && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300 font-sukar">
                      {t("product_details.item_number")}:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-sukar">
                      {product.items_no}
                    </span>
                  </div>
                )}
                {/* {product.final_price && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-none dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300 font-sukar flex items-center gap-2">
                      {t("product_details.final_price")}:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-sukar">
                      {product.final_price}
                    </span>
                  </div>
                )} */}
              </div>
            </div>
            {/* Quantity & Buy Section */}
            <div className="flex items-center gap-4 mt-8 w-full">
              {/* Left: Cart & Favorite */}
              <div className="flex gap-2">
                <button
                  className={`min-w-[3rem] flex items-center justify-center border rounded-none transition-all duration-200 font-sukar
                    ${
                      isInCart
                        ? "bg-red-100 border-red-400 text-red-700 px-4"
                        : added
                        ? "bg-green-100 border-green-400 text-green-700 px-4"
                        : "bg-white border-gray-200 text-[#607A76] hover:bg-gray-50 px-0"
                    }
                  `}
                  style={{ height: 48 }}
                  title={isInCart ? "Remove from Cart" : "Add to Cart"}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={added && !isInCart}
                >
                  <Icon
                    name="cart"
                    size={24}
                    className={
                      isInCart
                        ? "text-red-700"
                        : added
                        ? "text-green-700"
                        : "text-[#607A76]"
                    }
                  />
                  {isInCart && (
                    <span
                      className="ml-2 text-red-700 font-bold text-md"
                      style={{ paddingTop: 4 }}
                    >
                      Remove
                    </span>
                  )}
                  {added && !isInCart && (
                    <span
                      className="ml-2 text-green-700 font-bold text-md"
                      style={{ paddingTop: 4 }}
                    >
                      Added!
                    </span>
                  )}
                </button>
                <button
                  className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-none"
                  title={isSaved ? "Remove from Favorites" : "Add to Favorites"}
                  type="button"
                  onClick={handleToggleFavorite}
                  aria-pressed={isSaved}
                >
                  <Icon
                    name={isSaved ? "heart-filled" : "heart"}
                    size={24}
                    className={isSaved ? "text-[#e74c3c]" : "text-gray-400"}
                  />
                </button>
              </div>
              {/* Center: Buy Button */}
              <button
                className="flex-1 h-12 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
                style={{ minWidth: 180 }}
                type="button"
              >
                Buy Product
              </button>
              {/* Right: Quantity Selector */}
              <div className="flex items-center gap-0">
                <button
                  className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-none text-2xl text-[#607A76]"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  type="button"
                >
                  –
                </button>
                <span className="w-12 h-12 flex items-center justify-center bg-white border-t border-b border-gray-200 rounded-none text-lg font-bold font-sukar text-gray-800">
                  {quantity}
                </span>
                <button
                  className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-none text-2xl text-[#607A76]"
                  onClick={() => setQuantity((q) => q + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <YouMayAlsoLikeSection relatedProducts={relatedProducts} />
      <ProductBannerSection />
      <WhyChooseUsSection />
      <ContactUsBannerSection />
    </MainLayout>
  );
}
