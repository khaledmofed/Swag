"use client";
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AccountSidebar } from "@/components/common/AccountSidebar";
import { Icon } from "@/components/common/Icon";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";

const BASE_URL = "https://swag.ivadso.com";
const EMPTY_IMAGE = "/images/empty-favorites.png";
const ORDERS_PER_PAGE = 8;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  under_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
  on_delivery: "bg-green-100 text-green-800 border-green-200",
  on_preparation: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const fetchOrders = async (token: string) => {
  const res = await axios.get(`${BASE_URL}/api/store/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default function OrdersPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  // جلب الطلبات من API
  const {
    data: ordersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", token],
    queryFn: () => fetchOrders(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  // استخراج الطلبات من الاستجابة الصحيحة
  const orders = ordersData?.data?.orders || [];
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginated = orders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] dark:bg-[#181e1e] font-sukar">
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10 flex flex-col md:flex-row gap-8">
          <AccountSidebar
            activeItem="Orders"
            onMenuClick={(label) => {
              if (label === "Profile") router.push("/profile");
              else if (label === "View Saved Products")
                router.push("/saved-products");
              else if (label === "Orders") router.push("/orders");
              // else if (label === "Addresses") router.push("/addresses");
              // else if (label === "Change Password")
              //   router.push("/change-password");
            }}
          />
          <main className="flex-1 bg-white dark:bg-[#2c2c2c] rounded-none border border-gray-200 dark:border-[#353535] p-8">
            {!token ? (
              <div className="text-center text-red-600 py-20">
                يجب تسجيل الدخول لعرض الطلبات
              </div>
            ) : isLoading ? (
              <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-8 w-48 bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>
                  <div className="h-10 w-96 bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>
                </div>

                {/* Table Skeleton */}
                <div className="overflow-x-auto rounded-none border border-gray-100 dark:border-[#353535] bg-[#f9f9fa] dark:bg-[#232b2b]">
                  {/* Table Header Skeleton */}
                  <div className="bg-[#f5f8f7] dark:bg-[#232b2b] px-4 py-3">
                    <div className="grid grid-cols-6 gap-4">
                      <div className="h-4 w-8 bg-gray-300 dark:bg-[#444] rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-300 dark:bg-[#444] rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-300 dark:bg-[#444] rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-300 dark:bg-[#444] rounded animate-pulse"></div>
                      <div className="h-4 w-28 bg-gray-300 dark:bg-[#444] rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-300 dark:bg-[#444] rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Table Rows Skeleton */}
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 border-b border-gray-200 dark:border-[#353535] last:border-b-0"
                    >
                      <div className="grid grid-cols-6 gap-4 items-center">
                        {/* Order ID */}
                        <div className="h-4 w-6 bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>

                        {/* Product */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>
                            <div className="h-3 w-20 bg-green-200 dark:bg-green-800 rounded animate-pulse"></div>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="h-4 w-8 bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>

                        {/* Order Date */}
                        <div className="h-4 w-20 bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>

                        {/* Order Status */}
                        <div className="h-6 w-16 bg-yellow-200 dark:bg-yellow-800 rounded-full animate-pulse"></div>

                        {/* Action */}
                        <div className="h-6 w-6 bg-gray-200 dark:bg-[#353535] rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-[#232b2b] rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-[#607A76] rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-[#232b2b] rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-[#232b2b] rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-[#232b2b] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : isError ? (
              <div className="text-center text-red-600 py-20">
                {t("orders.error_loading")}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-6">
                <div className="flex-2 flex flex-col items-start justify-center">
                  <h1
                    className="text-3xl md:text-4xl font-sukar font-bold mb-4"
                    style={{ lineHeight: "30px" }}
                  >
                    {t("orders.empty_title")}
                  </h1>
                  <p
                    className="text-lg font-sukar text-[#607A76] font-semibold mb-6"
                    style={{ lineHeight: "22px" }}
                  >
                    {t("orders.empty_desc")}
                  </p>
                  <button
                    className="flex-1 h-12 px-6 py-2 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
                    onClick={() => router.push("/store")}
                  >
                    {t("orders.start_shopping")}
                  </button>
                </div>
                <div className="flex-2 flex items-center justify-end">
                  <img
                    src={EMPTY_IMAGE}
                    alt="Empty orders"
                    className="w-100 select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#607A76] font-sukar">
                    {t("orders.title")}
                  </h2>
                  <input
                    type="text"
                    placeholder={t("orders.search_placeholder")}
                    className="border border-gray-200 dark:border-[#353535] rounded-none px-4 py-2 bg-white dark:bg-[#232b2b] text-gray-700 dark:text-white font-sukar w-96"
                  />
                </div>
                <div className="overflow-x-auto rounded-none border border-gray-100 dark:border-[#353535] bg-[#f9f9fa] dark:bg-[#232b2b]">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-[#353535]">
                    <thead className="bg-[#f5f8f7] dark:bg-[#232b2b]">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#607A76]">
                          {t("orders.table.order_id")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#607A76]">
                          {t("orders.table.product")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#607A76]">
                          {t("orders.table.quantity")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#607A76]">
                          {t("orders.table.order_date")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#607A76]">
                          {t("orders.table.order_status")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#607A76]">
                          {t("orders.table.action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((order: any, idx: number) => (
                        <tr
                          key={order.id || idx}
                          className="hover:bg-gray-50 dark:hover:bg-[#232b2b] cursor-pointer"
                        >
                          <td className="px-4 py-3 text-[#607A76] font-bold">
                            {order.id}
                          </td>
                          <td className="px-4 py-3 flex items-center gap-3">
                            <img
                              src={order.items?.[0]?.product?.image}
                              alt=""
                              className="w-12 h-12 object-cover rounded-none "
                            />
                            <div>
                              <div className="font-bold text-gray-800 dark:text-white">
                                {order.items?.[0]?.product?.name}
                              </div>
                              <div className="text-green-700 font-bold">
                                {order.items?.[0]?.price} SAR
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {order.items?.reduce(
                              (sum: number, item: any) =>
                                sum + (item.quantity || 1),
                              0
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${
                                STATUS_COLORS[order.status] ||
                                "bg-gray-100 text-gray-700 border-gray-200"
                              }`}
                            >
                              {t(`orders.status.${order.status}`)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="hover:bg-gray-200 dark:hover:bg-[#353535] p-2 rounded-none "
                            >
                              <Icon name="eye" size={22} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 rounded-none bg-gray-100 dark:bg-[#232b2b] text-gray-700 dark:text-white font-bold disabled:opacity-50"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        &lt;
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          className={`px-3 py-1 rounded-none font-bold ${
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
                        className="px-3 py-1 rounded-none bg-gray-100 dark:bg-[#232b2b] text-gray-700 dark:text-white font-bold disabled:opacity-50"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                      >
                        &gt;
                      </button>
                    </nav>
                  </div>
                )}
                {/* Order Details Modal */}
                {selectedOrder && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    style={{ background: "rgba(0,0,0,0.19)" }}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) setSelectedOrder(null);
                    }}
                  >
                    <div className="bg-[#f7f9f8] dark:bg-[#181e1e] rounded-none shadow-lg max-w-5xl w-full relative border border-[#e3e7e5] dark:border-[#232b2b] p-0 overflow-hidden">
                      {/* Top Bar with Close and Breadcrumb */}
                      <div className="flex items-center justify-between px-8 py-2 border-b border-[#e3e7e5] dark:border-[#232b2b] bg-white dark:bg-[#232b2b]">
                        <button
                          className="flex items-center gap-2 text-[#607A76] hover:text-[#3d4e4b] text-2xl font-bold"
                          onClick={() => setSelectedOrder(null)}
                        >
                          <Icon name="x" size={32} />
                        </button>
                        <nav className="flex-1 flex items-center justify-center gap-2 text-[#607A76] text-base font-sukar font-semibold">
                          <span className="opacity-70">Order Management</span>
                          <span className="mx-1">&#8250;</span>
                          <span className="opacity-70">
                            Order Number #{selectedOrder.id}
                          </span>
                          <span className="mx-1">&#8250;</span>
                          <span className="text-[#607A76] font-bold">
                            Order Details
                          </span>
                        </nav>
                        <div style={{ width: 40 }} />
                      </div>
                      {/* Main Content */}
                      <div className="px-4 py-4 bg-[#f7f9f8] dark:bg-[#181e1e]">
                        {/* Order Info Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-1">
                          <div className="bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-4">
                            <div className="flex items-center gap-3 mb-0">
                              <div className="w-10 h-10 bg-[#f0f4f3] dark:bg-[#2a2a2a] rounded-none flex items-center justify-center">
                                <Icon
                                  name="calendar"
                                  size={20}
                                  className="text-[#607A76]"
                                />
                              </div>
                              <div>
                                <div className="text-sm  font-sukar">
                                  Order Date
                                </div>
                                <div
                                  className="font-bold text-[#607A76] font-sukar"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                  }}
                                >
                                  {formatDate(selectedOrder.created_at)}
                                  <div
                                    className="text-xs text-gray-600 dark:text-gray-400"
                                    style={{
                                      marginLeft: "10px",
                                      marginRight: "10px",
                                    }}
                                  >
                                    {new Date(
                                      selectedOrder.created_at
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-4">
                            <div className="flex items-center gap-3 mb-0">
                              <div className="w-10 h-10 bg-[#f0f4f3] dark:bg-[#2a2a2a] rounded-none flex items-center justify-center">
                                <Icon
                                  name="credit-card"
                                  size={20}
                                  className="text-[#607A76]"
                                />
                              </div>
                              <div>
                                <div className="text-sm  font-sukar">
                                  Payment Method
                                </div>
                                <div className="font-bold text-[#607A76] font-sukar">
                                  {selectedOrder.payment_method ===
                                  "cash_on_delivery"
                                    ? "Cash on Delivery"
                                    : selectedOrder.payment_method}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-4">
                            <div className="flex items-center gap-3 mb-0">
                              <div className="w-10 h-10 bg-[#f0f4f3] dark:bg-[#2a2a2a] rounded-none flex items-center justify-center">
                                <Icon
                                  name="truck"
                                  size={20}
                                  className="text-[#607A76]"
                                />
                              </div>
                              <div>
                                <div className="text-sm  font-sukar">
                                  Shipping Method
                                </div>
                                <div className="font-bold text-[#607A76] font-sukar">
                                  Saree Company
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-4">
                            <div className="flex items-center gap-3 mb-0">
                              <div className="w-10 h-10 bg-[#f0f4f3] dark:bg-[#2a2a2a] rounded-none flex items-center justify-center">
                                <Icon
                                  name="globe"
                                  size={20}
                                  className="text-[#607A76]"
                                />
                              </div>
                              <div>
                                <div className="text-sm  font-sukar">
                                  Source of Order
                                </div>
                                <div className="font-bold text-[#607A76] font-sukar">
                                  SWAG
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ETA & Status Row */}
                        <div className="flex flex-col md:flex-row items-center justify-between mb-1 gap-2">
                          <div className="bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-4 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#f0f4f3] dark:bg-[#2a2a2a] rounded-none flex items-center justify-center">
                                <Icon
                                  name="clock"
                                  size={20}
                                  className="text-[#607A76]"
                                />
                              </div>
                              <div>
                                <div className="text-sm  font-sukar">
                                  Estimated Delivery
                                </div>
                                <div className="font-bold text-[#607A76] font-sukar">
                                  40-50 minutes
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#f0f4f3] dark:bg-[#2a2a2a] rounded-none flex items-center justify-center">
                                <Icon
                                  name="checkCircle"
                                  size={20}
                                  className="text-[#607A76]"
                                />
                              </div>
                              <div>
                                <div className="text-sm  font-sukar">
                                  Order Status
                                </div>
                                <span
                                  className={`inline-block px-3 py-1 rounded-full border text-sm font-bold ${
                                    STATUS_COLORS[selectedOrder.status] ||
                                    "bg-gray-100 text-gray-700 border-gray-200"
                                  }`}
                                >
                                  {selectedOrder.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Product Details & Invoice */}
                        <div className="flex flex-col md:flex-row gap-2">
                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="text-xl font-bold text-[#607A76] mb-2 mt-2">
                              Product Details
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedOrder.items.map(
                                (item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-4 min-h-[80px]"
                                  >
                                    <img
                                      src={item.product.image}
                                      alt=""
                                      className="w-16 h-16 object-cover rounded-none bg-[#f7f9f8] dark:bg-[#181e1e] border border-[#e3e7e5] dark:border-[#232b2b]"
                                    />
                                    <div className="flex-1">
                                      <div
                                        className="font-bold text-[#607A76] text-lg mb-0"
                                        style={{
                                          lineHeight: "17px",
                                          fontSize: "16px",
                                        }}
                                      >
                                        {item.product.name}
                                      </div>
                                      <div
                                        className="text-green-700 font-bold text-base"
                                        style={{
                                          fontSize: "14px",
                                        }}
                                      >
                                        {item.price} SAR
                                      </div>
                                      <div className="text-gray-600 text-sm">
                                        Quantity: {item.quantity}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          {/* Invoice */}
                          <div className="w-full md:w-80 flex-shrink-0">
                            <div className="bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-6 mb-1">
                              <div className="text-xl font-bold text-[#607A76] mb-4">
                                Invoice
                              </div>
                              <div className="flex flex-col gap-2 text-base">
                                <div className="flex justify-between">
                                  <span className="text-[#607A76]">
                                    Product Value
                                  </span>
                                  <span className="font-bold">
                                    {selectedOrder.total} SAR
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#607A76]">
                                    Delivery
                                  </span>
                                  <span className="font-bold">0.00 SAR</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#607A76]">
                                    Cash on Delivery
                                  </span>
                                  <span className="font-bold">10.00 SAR</span>
                                </div>
                                <div className="flex justify-between border-t border-[#e3e7e5] pt-2 mt-2">
                                  <span className="text-[#607A76] font-bold">
                                    Total Amount
                                  </span>
                                  <span className="font-bold text-[#607A76]">
                                    {selectedOrder.total} SAR
                                  </span>
                                </div>
                              </div>
                              <button className="mt-6 w-full py-3 bg-[#bfc7c4] hover:bg-[#aeb6b3] text-[#607A76] font-sukar text-lg font-bold rounded-none flex items-center justify-center border-none shadow-none transition-all">
                                Download Invoice
                              </button>
                            </div>
                            {/* FAQ & Support */}
                            <div className="flex flex-col gap-2">
                              <div className="bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-4 flex items-center gap-4">
                                <Icon
                                  name="life-buoy"
                                  size={28}
                                  className="text-[#607A76]"
                                />
                                <div>
                                  <div className="font-bold text-[#607A76]">
                                    Frequently Asked Questions
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                                    Fast answers to common questions
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white dark:bg-[#232b2b] border border-[#e3e7e5] dark:border-[#232b2b] rounded-none p-4 flex items-center gap-4">
                                <Icon
                                  name="phone"
                                  size={28}
                                  className="text-[#607A76]"
                                />
                                <div>
                                  <div className="font-bold text-[#607A76]">
                                    Talk to us directly
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                                    Available 24/7 to assist you
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Pagination for products if needed */}
                        {/* <div className="mt-4 text-sm text-gray-500">Page 1 of 10 <button className="ml-2 px-3 py-1 bg-gray-200 rounded">Previous</button> <button className="ml-2 px-3 py-1 bg-gray-200 rounded">Next</button></div> */}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </MainLayout>
    </div>
  );
}
