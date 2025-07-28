"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { ProductBannerSection } from "../products/ProductBannerSection";
import { WhyChooseUsSection } from "../store/WhyChooseUsSection";
import { ContactUsBannerSection } from "../store/ContactUsBannerSection";
import { Icon } from "@/components/common/Icon";
import { useCart, useAddToCart, useRemoveFromCart } from "@/hooks/api";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";

export default function CartPage() {
  const router = useRouter();
  const { profile, token } = useUserStore();
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();

  const { showToast } = useToastStore();

  // جلب cart من الـ API
  const { data: cartData, isLoading, isError, refetch } = useCart();
  console.log("cartData", cartData);

  // إضافة للسلة
  const addMutation = useAddToCart();

  // حذف من السلة
  const removeMutation = useRemoveFromCart();

  // حساب الإجماليات
  const subtotal =
    cartData?.data?.cart?.reduce(
      (sum: number, item: any) =>
        sum + Number(item.product?.price || 0) * Number(item.quantity || 1),
      0
    ) || 0;
  const SHIPPING_COST = 1200;
  const DISCOUNT = 5000;
  const total = subtotal + SHIPPING_COST - DISCOUNT;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-0 border-b border-gray-200 dark:border-color-dark">
        {/* Breadcrumb */}
        <nav
          className="flex items-center justify-center text-gray-400 text-md my-4 font-sukar"
          aria-label="Breadcrumb"
        >
          <a href="/" className="hover:text-primary-500 transition">
            {t("navigation.home")}
          </a>
          <span className="mx-2">&gt;</span>
          <span className="text-primary-600 font-semibold">
            {t("checkout.title")}
          </span>
        </nav>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10">
        {!token ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-6">
            <div className="flex-2 flex flex-col items-start justify-center">
              <h1
                className="text-3xl md:text-4xl font-sukar font-bold mb-4"
                style={{ lineHeight: "30px" }}
              >
                {t("cart.empty_title")}
              </h1>
              <p
                className="text-lg font-sukar text-[#607A76] font-semibold mb-6"
                style={{ lineHeight: "22px" }}
              >
                {t("cart.empty_desc")}
              </p>
              <button
                className="flex-1 h-12 px-6 py-2 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
                onClick={() => router.push("/login")}
              >
                {t("cart.sign_in")}
              </button>
            </div>
            <div className="flex-2 flex items-center justify-end">
              <img
                src="/images/no-token.png"
                alt="Empty cart"
                className="w-100 select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        ) : isLoading ? (
          <div className="text-center py-20">{t("cart.loading")}</div>
        ) : isError ? (
          <div className="text-center text-red-600 py-20">
            {t("cart.error")}
          </div>
        ) : cartData?.data?.cart?.length === 0 ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-16">
            <div className="flex-2 flex flex-col items-start justify-center">
              <h1 className="text-3xl md:text-4xl font-sukar font-bold mb-4">
                {t("cart.lonely_title")}
              </h1>
              <p className="text-lg font-sukar text-[#607A76] font-semibold mb-6">
                {t("cart.lonely_desc")}
              </p>
            </div>
            <div className="flex-1 flex items-center justify-end">
              <img
                src="/images/shopping-basket.png"
                alt="Empty cart"
                className="h-64 select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Forms */}
            <div className="flex-1">
              {/* 01 Personal Details */}
              <div className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-[#353535] rounded-none p-6 mb-6">
                <h3 className="text-xl font-sukar font-bold mb-4">
                  01 {t("checkout.personal_details")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("checkout.first_name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("checkout.first_name")}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("checkout.last_name")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("checkout.last_name")}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("checkout.email")}
                    </label>
                    <input
                      type="email"
                      placeholder={t("checkout.email")}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("checkout.phone")}
                    </label>
                    <div className="flex">
                      <select className="px-3 py-3 border border-r-0 border-gray-300 dark:border-[#353535] rounded-l-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none">
                        <option value="+966">+966</option>
                        <option value="+971">+971</option>
                        <option value="+965">+965</option>
                        <option value="+973">+973</option>
                      </select>
                      <input
                        type="tel"
                        placeholder={t("checkout.phone")}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-r-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 02 Shipping Details */}
              <div className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-[#353535] rounded-none p-6 mb-6">
                <h3 className="text-xl font-sukar font-bold mb-4">
                  02 {t("checkout.shipping_details")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("checkout.address")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("checkout.address")}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.postal_code")}
                      </label>
                      <input
                        type="text"
                        placeholder={t("checkout.postal_code")}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.city")}
                      </label>
                      <input
                        type="text"
                        placeholder={t("checkout.city")}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.country")}
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent">
                        <option value="">{t("checkout.country")}</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="AE">United Arab Emirates</option>
                        <option value="KW">Kuwait</option>
                        <option value="BH">Bahrain</option>
                        <option value="OM">Oman</option>
                        <option value="QA">Qatar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 03 Payment Details */}
              <div className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-[#353535] rounded-none p-6">
                <h3 className="text-xl font-sukar font-bold mb-4">
                  03 {t("checkout.payment_details")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("checkout.card_number")}
                    </label>
                    <div className="relative">
                      <Icon
                        name="credit-card"
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder={t("checkout.card_number")}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.expiry_date")}
                      </label>
                      <div className="relative">
                        <Icon
                          name="calendar"
                          size={20}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.cvv")}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={t("checkout.cvv")}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                        />
                        <Icon
                          name="chevron-down"
                          size={20}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="w-full lg:w-[420px] bg-[#f5f8f7] dark:bg-[#353535] border border-gray-100 dark:border-[#353535] rounded-none p-6 h-fit">
              <h2 className="text-2xl font-sukar font-bold mb-3">
                {t("cart.order_summary")}
              </h2>
              <div className="flex flex-col gap-3 mb-6 font-sukar">
                {cartData?.data?.cart?.map((item: any) => (
                  <div
                    key={item.product_id}
                    className="flex gap-4 items-start border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={getImageUrl(item.product?.image)}
                      alt={item.product?.title}
                      className="w-20 h-20 object-cover rounded-none"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0">
                        <div className="font-sukar font-bold">
                          {item.product?.name}
                        </div>
                        <div className="font-sukar font-semibold text-md">
                          {item.product?.price?.toLocaleString()} SAR
                        </div>
                      </div>
                      <div className="text-md mb-1 line-clamp-2">
                        {item.product?.description}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 border border-gray-300 rounded-none text-sm"
                          onClick={() =>
                            addMutation.mutate(
                              {
                                productId: item.product_id,
                                quantity: -1,
                              },
                              {
                                onSuccess: (data) => {
                                  showToast(
                                    data?.msg || t("toast.cart_updated")
                                  );
                                },
                                onError: (error) => {
                                  showToast(t("toast.cart_update_failed"));
                                },
                              }
                            )
                          }
                          disabled={addMutation.isPending}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 border border-gray-300 rounded-none text-sm"
                          onClick={() =>
                            addMutation.mutate(
                              {
                                productId: item.product_id,
                                quantity: 1,
                              },
                              {
                                onSuccess: (data) => {
                                  showToast(
                                    data?.msg || t("toast.cart_updated")
                                  );
                                },
                                onError: (error) => {
                                  showToast(t("toast.cart_update_failed"));
                                },
                              }
                            )
                          }
                          disabled={addMutation.isPending}
                        >
                          +
                        </button>
                        <button
                          className="ml-4 w-8 h-8 py-1 bg-red-100 text-red-700 rounded-none hover:bg-red-200 text-xs font-bold transition"
                          onClick={() =>
                            removeMutation.mutate(item.product_id, {
                              onSuccess: (data) => {
                                showToast(
                                  data?.msg || t("toast.product_removed")
                                );
                              },
                              onError: (error) => {
                                showToast(t("toast.remove_failed"));
                              },
                            })
                          }
                          disabled={removeMutation.isPending}
                        >
                          <Icon
                            name="trash"
                            size={16}
                            style={{ margin: "0 auto" }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-sm font-sukar">
                <div className="flex justify-between">
                  <span>{t("cart.subtotal")}</span>
                  <span>
                    {subtotal ? subtotal.toLocaleString() : 0} {t("cart.sar")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.shipping_cost")}</span>
                  <span>
                    {SHIPPING_COST.toLocaleString()} {t("cart.sar")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t("cart.discount")} (5,000 {t("cart.sar")})
                  </span>
                  <span>
                    {DISCOUNT.toLocaleString()} {t("cart.sar")}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>{t("cart.total")}</span>
                  <span>
                    {total ? total.toLocaleString() : 0} {t("cart.sar")}
                  </span>
                </div>
              </div>
              <button
                className="w-full mt-6 py-3 bg-[#aab7b2] font-sukar text-lg font-bold rounded-none text-gray-800 hover:bg-[#9ba8a3] transition-colors"
                // onClick={handleCheckout}
                disabled
              >
                {t("cart.checkout")}
              </button>
            </div>
          </div>
        )}
      </div>
      <ProductBannerSection />
      <WhyChooseUsSection />
      <ContactUsBannerSection />
    </MainLayout>
  );
}
