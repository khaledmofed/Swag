import { cn, getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { Button } from "../ui/button";
import React, { useEffect, useState } from "react";
import {
  useFavorites,
  useToggleFavorite,
  useAddToCart,
  useCart,
  useRemoveFromCart,
} from "@/hooks/api";
import { useUserStore } from "@/stores/userStore";
import { useToastStore } from "@/stores/toastStore";
import { getAuthToken } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useSocketPricing } from "@/hooks/useSocketPricing";

interface ProductCardProps {
  title: string;
  price: string | React.ReactNode;
  image: string;
  isNew?: boolean;
  slug?: string;
  id?: string; // Add product ID
  karat?: string | number; // إضافة العيار
  metal?: string; // إضافة المعدن
  weight?: number; // إضافة الوزن
  manufacturingCost?: number; // سعر المصنعية
  onAddToBag?: () => void;
  onMaximize?: () => void;
  onFavorite?: () => void;
  className?: string;
}

export function ProductCard(props: ProductCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const { token } = useUserStore();
  const { showToast } = useToastStore();
  const { t } = useTranslation();

  // استخدام هوك Socket للأسعار المباشرة
  const {
    isConnected,
    priceUpdates,
    broadcastData,
    getCurrentPrice,
    getLastPriceUpdate,
  } = useSocketPricing();

  // حالة السعر المحسوب
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  // دالة حساب السعر الحقيقي
  const calculateRealPrice = () => {
    // رسائل تشخيص فقط للمنتج الأول
    const isFirstProduct = props.id === "1";

    if (isFirstProduct) {
      console.log(`🔍 Starting price calculation for ${props.title}`);
    }

    // التحقق من البيانات المطلوبة
    if (!props.karat) {
      if (isFirstProduct)
        console.warn(`❌ Missing karat for ${props.title}:`, props.karat);
      return null;
    }
    if (!props.metal) {
      if (isFirstProduct)
        console.warn(`❌ Missing metal for ${props.title}:`, props.metal);
      return null;
    }
    if (!props.weight) {
      if (isFirstProduct)
        console.warn(`❌ Missing weight for ${props.title}:`, props.weight);
      return null;
    }
    if (!props.manufacturingCost) {
      if (isFirstProduct)
        console.warn(
          `❌ Missing manufacturingCost for ${props.title}:`,
          props.manufacturingCost
        );
      return null;
    }
    if (!priceUpdates.length && !broadcastData) {
      if (isFirstProduct)
        console.warn(`❌ Missing price data for ${props.title}`);
      return null;
    }

    // تحديد اسم السعر في Socket بناءً على المعدن والعيار
    let socketPriceName = "";

    if (props.metal.toLowerCase() === "gold") {
      socketPriceName = `gold-price-region${props.karat}`;
    } else if (props.metal.toLowerCase() === "silver") {
      socketPriceName = "silversounces";
    } else {
      console.warn(`❌ Unknown metal type: ${props.metal}`);
      return null;
    }

    if (isFirstProduct) {
      console.log(`🔎 Looking for price key: ${socketPriceName}`);
      console.log(
        `💹 Available price updates:`,
        priceUpdates.map((p) => p.priceName)
      );
    }

    // الحصول على سعر البورصة من priceUpdates أولاً (أحدث البيانات)
    let exchangeRate = null;
    const latestUpdate = priceUpdates.find(
      (update) => update.priceName === socketPriceName
    );

    if (latestUpdate) {
      exchangeRate = latestUpdate.newPrice;
      if (isFirstProduct)
        console.log(`✅ Found exchange rate in priceUpdates: ${exchangeRate}`);
    } else if (broadcastData && broadcastData[socketPriceName]) {
      exchangeRate = broadcastData[socketPriceName];
      if (isFirstProduct)
        console.log(`✅ Found exchange rate in broadcastData: ${exchangeRate}`);
    }

    if (!exchangeRate && exchangeRate !== 0) {
      if (isFirstProduct) {
        console.warn(`❌ Exchange rate not found for: ${socketPriceName}`);
        console.warn(`📊 Available priceUpdates:`, priceUpdates);
      }
      return null;
    }

    // حساب السعر: (سعر البورصة للعيار + سعر المصنعية للجرام) × الوزن
    const totalPrice = (exchangeRate + props.manufacturingCost) * props.weight;

    if (isFirstProduct) {
      console.log(`💰 Price calculation for ${props.title}:`, {
        metal: props.metal,
        karat: props.karat,
        weight: props.weight,
        manufacturingCost: props.manufacturingCost,
        socketPriceName,
        exchangeRate,
        calculation: `(${exchangeRate} + ${props.manufacturingCost}) × ${props.weight}`,
        totalPrice: totalPrice.toFixed(2),
      });
    }

    return totalPrice;
  };

  // جلب المفضلة من API
  const { data: favData } = useFavorites();

  // إضافة/حذف من المفضلة
  const toggleFavourite = useToggleFavorite();

  // إضافة للسلة
  const addToCart = useAddToCart();

  // حذف من السلة
  const removeFromCart = useRemoveFromCart();

  // جلب بيانات السلة
  const { data: cartData } = useCart();

  // حالة المنتج في السلة
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (!props.id) return;

    // إذا لم يكن هناك توكن، تأكد من أن المنتج غير محفوظ
    if (!token) {
      setIsSaved(false);
      setIsInCart(false);
      return;
    }

    if (typeof window !== "undefined") {
      // التحقق من وجود المنتج في المفضلة من خلال product_id
      console.log("Product ID:", props.id);
      console.log("Token:", token);
      console.log("Favorites data:", favData?.data?.favorite);

      const saved =
        favData?.data?.favorite?.some(
          (p: any) => p.product_id === Number(props.id)
        ) || false;

      console.log("Is saved:", saved);
      setIsSaved(saved);

      // التحقق من وجود المنتج في السلة
      const inCart =
        cartData?.data?.cart?.some(
          (item: any) => item.product_id === Number(props.id)
        ) || false;

      console.log("Is in cart:", inCart);
      setIsInCart(inCart);
    }
  }, [props.id, favData, cartData, token]);

  // مستمع لحدث تسجيل الخروج
  useEffect(() => {
    const handleLogout = () => {
      console.log("ProductCard - Logout detected, setting isSaved to false");
      setIsSaved(false);
      setIsInCart(false);
    };

    const handleLogin = () => {
      console.log("ProductCard - Login detected, will check favorites");
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
      console.log("ProductCard - Logout detected for cart");
    };

    const handleLogin = () => {
      console.log("ProductCard - Login detected for cart");
    };

    window.addEventListener("user-logged-out", handleLogout);
    window.addEventListener("user-logged-in", handleLogin);

    return () => {
      window.removeEventListener("user-logged-out", handleLogout);
      window.removeEventListener("user-logged-in", handleLogin);
    };
  }, []);

  // مراقبة بيانات المنتج (فقط للمنتج الأول للتشخيص)
  useEffect(() => {
    if (props.id === "1") {
      // فقط للمنتج الأول
      console.log(`🛍️ Product data for ${props.title}:`, {
        karat: props.karat,
        metal: props.metal,
        weight: props.weight,
        manufacturingCost: props.manufacturingCost,
      });
    }
  }, [
    props.karat,
    props.metal,
    props.weight,
    props.manufacturingCost,
    props.title,
    props.id,
  ]);

  // حساب السعر الحقيقي عند تغيير بيانات Socket
  useEffect(() => {
    const newCalculatedPrice = calculateRealPrice();

    if (newCalculatedPrice !== null && newCalculatedPrice !== calculatedPrice) {
      setCalculatedPrice(newCalculatedPrice);
      if (props.id === "1") {
        // فقط للمنتج الأول
        // console.log(
        //   `🔄 Price updated for ${props.title}: ${newCalculatedPrice.toFixed(
        //     2
        //   )} (Live)`
        // );
      }
    }
  }, [
    broadcastData,
    priceUpdates,
    props.karat,
    props.metal,
    props.weight,
    props.manufacturingCost,
  ]);

  // مراقبة تحديثات الأسعار من Socket وطباعتها في الكونسول
  useEffect(() => {
    console.log("🔌 Socket connection status:", isConnected);
    console.log("📊 Current broadcast data:", broadcastData);
    console.log("💹 Latest price updates:", priceUpdates);

    if (priceUpdates.length > 0) {
      console.log("🆕 New price updates received:");
      priceUpdates.forEach((update) => {
        console.log(
          `  - ${update.priceName}: ${update.newPrice} (${update.direction}) [${update.color}]`
        );
      });
    }

    // طباعة أسعار الذهب الحالية
    const gold24Price = getCurrentPrice(24);
    const gold21Price = getCurrentPrice(21);
    const gold18Price = getCurrentPrice(18);

    console.log("🥇 Current Gold Prices:", {
      "24K": gold24Price,
      "21K": gold21Price,
      "18K": gold18Price,
    });

    // طباعة جميع البيانات المتوفرة في broadcastData
    if (broadcastData) {
      console.log(
        "📡 All available broadcast data keys:",
        Object.keys(broadcastData)
      );
      console.log("📡 Full broadcast data:", broadcastData);
    }

    // طباعة آخر التحديثات لأسعار مهمة
    const importantPrices = [
      "gold-price-region24",
      "gold-price-region21",
      "gold-price-region18",
      "goldsounces",
      "silversounces",
    ];

    importantPrices.forEach((priceName) => {
      const lastUpdate = getLastPriceUpdate(priceName);
      if (lastUpdate) {
        console.log(`📈 Last update for ${priceName}:`, lastUpdate);
      }
    });
  }, [
    isConnected,
    broadcastData,
    priceUpdates,
    getCurrentPrice,
    getLastPriceUpdate,
  ]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();

    // التحقق من تسجيل الدخول
    if (!token) {
      showToast(t("toast.login_required"));
      return;
    }

    if (!props.id) return;

    // إضافة/حذف من المفضلة
    toggleFavourite.mutate(Number(props.id), {
      onSuccess: (data) => {
        console.log("Toggle favorite response:", data);
        // عرض رسالة النجاح من الـ API
        const successMessage = isSaved
          ? t("toast.favorite_removed")
          : t("toast.favorite_added");
        showToast(data?.msg || successMessage);

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

        // تحديث فوري من API للتأكد من صحة البيانات
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("saved-products-updated", {
              detail: { count: null }, // سيتم التحديث من API
            })
          );
        }, 500);
      },
      onError: (error) => {
        console.log("Toggle favorite error:", error);
        // عرض رسالة الخطأ
        showToast(t("toast.cart_update_failed"));
      },
    });
  };

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation();

    // التحقق من تسجيل الدخول
    if (!token) {
      showToast(t("toast.login_required"));
      return;
    }

    if (!props.id) return;

    if (isInCart) {
      // حذف من السلة
      removeFromCart.mutate(Number(props.id), {
        onSuccess: (data) => {
          console.log("Remove from cart response:", data);
          showToast(data?.msg || t("toast.product_removed"));
        },
        onError: (error) => {
          console.log("Remove from cart error:", error);
          showToast(t("toast.remove_failed"));
        },
      });
    } else {
      // إضافة للسلة
      addToCart.mutate(
        { productId: Number(props.id), quantity: 1 },
        {
          onSuccess: (data) => {
            console.log("Add to cart response:", data);
            showToast(data?.msg || t("toast.cart_updated"));
          },
          onError: (error) => {
            console.log("Add to cart error:", error);
            showToast(t("toast.cart_update_failed"));
          },
        }
      );
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden group flex flex-col min-h-[320px] cursor-pointer",
        props.className
      )}
      style={{ minHeight: 340 }}
      onClick={() => {
        if (props.id) {
          router.push(`/products/${props.id}`);
        }
      }}
    >
      {/* Image area */}
      <div className="relative w-full aspect-square bg-gradient-to-b from-[#f5f7f7] to-[#c7d6d6] flex items-center justify-center overflow-hidden">
        {/* Heart Icon */}
        <button
          className="absolute top-4 left-4 z-35 bg-white/80 rounded-full p-1.5 hover:bg-primary-100 transition"
          onClick={handleFavorite}
        >
          <Icon
            name={isSaved ? "heart-filled" : "heart"}
            size={20}
            className={isSaved ? "text-[#e74c3c]" : "text-gray-400"}
          />
        </button>
        <img
          src={getImageUrl(props.image)}
          alt={props.title}
          className="w-full h-full object-cover z-10"
        />
        {/* Hover actions */}
        <div className="absolute inset-0 flex flex-col items-end justify-end pb-0 px-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-full flex justify-between items-center mb-3 px-4">
            <button
              className="bg-white/80 rounded-full p-2 hover:bg-primary-100 transition"
              onClick={(e) => {
                e.stopPropagation();
                props.onMaximize && props.onMaximize();
              }}
            >
              <Icon name="maximize" size={20} className="text-gray-700" />
            </button>
            {props.isNew && (
              <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded absolute top-0 right-0 m-2">
                New
              </span>
            )}
          </div>
          <Button
            className={`w-full h-10 mx-auto font-sukar text-base font-bold py-3 px-2 rounded-none shadow-none transition-all duration-150 ${
              isInCart
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-[#607A76] text-white hover:bg-[#4d625e]"
            }`}
            style={{ borderRadius: 0, boxShadow: "none" }}
            onClick={handleAddToBag}
          >
            {isInCart ? t("product.remove_from_cart") : t("product.add_to_bag")}
          </Button>
        </div>
      </div>
      {/* Product Info */}
      <div className="bg-transparent p-4 flex-1 flex flex-col justify-start">
        <div
          className="font-sukar text-base md:text-lg font-bold mb-1 text-gray-800 dark:text-gray-100"
          style={{ letterSpacing: "0.3px" }}
        >
          {props.title}
        </div>
        <div
          className="text-base font-en font-semibold flex items-center gap-1"
          style={{ color: "#607A76", letterSpacing: "0.5px" }}
        >
          {/* عرض السعر المحسوب (Live) أو السعر الأصلي (المصنعية فقط) */}
          {calculatedPrice !== null ? (
            <>
              {calculatedPrice.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
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
              {/* <span className="text-xs text-green-600 ml-1 font-bold">
                LIVE
              </span> */}
            </>
          ) : typeof props.price === "string" ? (
            <>
              {props.price
                .replace("$", "")
                .replace("USD", "")
                .replace("SAR", "")
                .replace("AED", "")
                .trim()}
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
            </>
          ) : (
            <>
              {props.price}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
