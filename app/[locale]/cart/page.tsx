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
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddAddressForm } from "@/components/AddAddressForm";

export default function CartPage() {
  const router = useRouter();
  const { profile, token } = useUserStore();
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();

  const { showToast } = useToastStore();

  // State for form data
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: "",
    postal_code: "",
    city: "",
    country: "",
  });

  // State for addresses
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  // جلب cart من الـ API
  const { data: cartData, isLoading, isError, refetch } = useCart();
  console.log("cartData", cartData);

  // جلب العناوين من API
  const {
    data: addressesData,
    isLoading: addressesLoading,
    isError: addressesError,
  } = useQuery({
    queryKey: ["addresses", token],
    queryFn: async () => {
      const res = await axios.get(
        "https://swag.ivadso.com/api/store/my_addresses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  // إضافة للسلة
  const addMutation = useAddToCart();

  // حذف من السلة
  const removeMutation = useRemoveFromCart();

  // إضافة عنوان جديد
  const addAddressMutation = useMutation({
    mutationFn: async (addressData: any) => {
      const res = await axios.post(
        "https://swag.ivadso.com/api/store/add_address",
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      // Refetch addresses
      window.location.reload();
    },
  });

  // إضافة طلب جديد
  const addOrderMutation = useMutation({
    mutationFn: async (shippingAddressId: number) => {
      const res = await axios.post(
        `https://swag.ivadso.com/api/store/add_order?shiiping_address=${shippingAddressId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setIsLoadingOrder(false);
      setIsSuccessDialogOpen(true);
      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        router.push("/orders");
      }, 3000);
    },
    onError: (error) => {
      setIsLoadingOrder(false);
      showToast("Failed to place order. Please try again.");
    },
  });

  // حساب الإجماليات
  const subtotal =
    cartData?.data?.cart?.reduce(
      (sum: number, item: any) =>
        sum + Number(item.product?.price || 0) * Number(item.quantity || 1),
      0
    ) || 0;
  const SHIPPING_COST = 99.7;
  const DISCOUNT = 200;
  const total = subtotal + SHIPPING_COST - DISCOUNT;

  // استخراج العناوين من الاستجابة الصحيحة
  const addresses = addressesData?.data?.addresses || [];

  // التحقق من اكتمال البيانات الشخصية
  const isPersonalDataComplete = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim()
    );
  };

  // التحقق من اكتمال بيانات الشحن
  const isShippingDataComplete = () => {
    return (
      formData.address.trim() &&
      formData.postal_code.trim() &&
      formData.city.trim() &&
      formData.country.trim()
    );
  };

  // التحقق من اختيار عنوان
  const isAddressSelected = () => {
    return selectedAddressId !== null;
  };

  // التحقق من اكتمال جميع البيانات
  const isAllDataComplete = () => {
    return (
      isPersonalDataComplete() &&
      (isAddressSelected() || isShippingDataComplete())
    );
  };

  // معالجة إضافة عنوان جديد
  const handleAddAddress = (addressData: any) => {
    addAddressMutation.mutate(addressData);
  };

  // معالجة إضافة طلب
  const handlePlaceOrder = () => {
    if (!isAllDataComplete()) {
      showToast(
        "Please complete all required information before placing order."
      );
      return;
    }

    if (!selectedAddressId) {
      showToast("Please select a shipping address or add a new one.");
      return;
    }

    setIsLoadingOrder(true);
    addOrderMutation.mutate(selectedAddressId);
  };

  // تحميل بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: "",
        postal_code: "",
        city: "",
        country: "",
      });
    }
  }, [profile]);

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
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
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
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
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
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
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
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
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

                {/* Existing Addresses */}
                {addressesLoading ? (
                  <div className="text-center py-4">Loading addresses...</div>
                ) : addressesError ? (
                  <div className="text-center text-red-600 py-4">
                    Error loading addresses
                  </div>
                ) : addresses.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    <h4 className="font-sukar font-semibold text-gray-700 dark:text-gray-300">
                      Select Shipping Address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address: any) => (
                        <div
                          key={address.id}
                          className={`border rounded-none p-4 cursor-pointer transition-colors ${
                            selectedAddressId === address.id
                              ? "border-[#607A76] bg-[#f0f4f3] dark:bg-[#2a2a2a]"
                              : "border-gray-200 dark:border-[#353535] hover:border-[#607A76]"
                          }`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddressId === address.id}
                              onChange={() => setSelectedAddressId(address.id)}
                              className="mt-1 text-[#607A76] focus:ring-[#607A76]"
                            />
                            <div className="flex-1">
                              <div className="font-sukar font-semibold text-gray-800 dark:text-white">
                                {address.address}
                              </div>
                              <div className="font-sukar text-md text-gray-600 dark:text-gray-300 mt-1">
                                {address.city}, {address.country} -{" "}
                                {address.postal_code}
                              </div>
                              <div className="font-sukar text-md text-gray-600 dark:text-gray-300">
                                Phone: {address.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Add New Address Button */}
                <div className="mb-6">
                  <Button
                    onClick={() => setIsAddAddressDialogOpen(true)}
                    className="bg-[#607A76] text-md hover:bg-[#4a5d5a] text-white font-sukar rounded-none"
                  >
                    <Icon name="plus" size={16} className="mr-1" />
                    Add New Address
                  </Button>
                </div>

                {/* Manual Address Form (if no addresses selected) */}
                {!selectedAddressId && (
                  <div className="space-y-4">
                    <h4 className="font-sukar font-semibold text-gray-700 dark:text-gray-300">
                      Or Enter Address Manually
                    </h4>
                    <div>
                      <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.address")}
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
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
                          value={formData.postal_code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postal_code: e.target.value,
                            })
                          }
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
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder={t("checkout.city")}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block font-sukar font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t("checkout.country")}
                        </label>
                        <select
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-[#353535] rounded-none bg-white dark:bg-[#232b2b] text-gray-900 dark:text-white font-sukar focus:outline-none focus:ring-2 focus:ring-[#607A76] focus:border-transparent"
                        >
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
                )}
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
                        <div className="font-sukar font-semibold text-md flex items-center gap-1">
                          {item.product?.price?.toLocaleString()}
                          <svg
                            id="Layer_1"
                            className="inline-block fill-747474 customeSize"
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
                        </div>
                      </div>
                      <div
                        className="text-md mb-1 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: item.product?.description,
                        }}
                      />
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
                  <span className="flex items-center gap-1">
                    {subtotal ? subtotal.toLocaleString() : 0}
                    <svg
                      id="Layer_1"
                      className="inline-block fill-747474 customeSize"
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
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.shipping_cost")}</span>
                  <span className="flex items-center gap-1">
                    {SHIPPING_COST.toLocaleString()}
                    <svg
                      id="Layer_1"
                      className="inline-block fill-747474 customeSize"
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
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t("cart.discount")} (2,00{" "}
                    <svg
                      id="Layer_1"
                      className="inline-block fill-747474 customeSize"
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
                    )
                  </span>
                  <span className="flex items-center gap-1">
                    {DISCOUNT.toLocaleString()}
                    <svg
                      id="Layer_1"
                      className="inline-block fill-747474 customeSize"
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
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>{t("cart.total")}</span>
                  <span className="flex items-center gap-1">
                    {total ? total.toLocaleString() : 0}
                    <svg
                      id="Layer_1"
                      className="inline-block fill-747474 customeSize"
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
                  </span>
                </div>
              </div>
              <button
                className="w-full mt-6 py-3 bg-[#aab7b2] font-sukar text-lg font-bold rounded-none text-gray-800 hover:bg-[#9ba8a3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePlaceOrder}
                disabled={isLoadingOrder || !isAllDataComplete()}
              >
                {isLoadingOrder ? "Processing..." : t("cart.checkout")}
              </button>
            </div>
          </div>
        )}
      </div>
      <ProductBannerSection />
      <WhyChooseUsSection />
      <ContactUsBannerSection />

      {/* Add Address Dialog */}
      <Dialog
        open={isAddAddressDialogOpen}
        onOpenChange={setIsAddAddressDialogOpen}
      >
        <DialogContent className="bg-white dark:bg-[#2c2c2c] border border-gray-200 rounded-none dark:border-[#353535]">
          <DialogHeader>
            <DialogTitle className="text-[#607A76] font-sukar">
              Add New Address
            </DialogTitle>
          </DialogHeader>
          <AddAddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setIsAddAddressDialogOpen(false)}
            isLoading={addAddressMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#2c2c2c] border border-gray-200 rounded-none dark:border-[#353535]">
          <DialogHeader>
            <DialogTitle className="text-[#607A76] font-sukar text-center">
              Order Placed Successfully! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="mb-4">
              <svg width="64" height="64" fill="none" className="mx-auto">
                <circle cx="32" cy="32" r="32" fill="#D1FADF" />
                <path
                  d="M20 34l8 8 16-16"
                  stroke="#12B76A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-lg font-sukar text-gray-700 dark:text-gray-300 mb-4">
              Your order has been placed successfully! You will be redirected to
              your orders page in a few seconds.
            </p>
            <Button
              onClick={() => router.push("/orders")}
              className="bg-[#607A76] hover:bg-[#4a5d5a] text-white font-sukar rounded-none"
            >
              View Orders Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
