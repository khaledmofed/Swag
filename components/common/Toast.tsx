import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
  const router = useRouter();
  const { t } = useTranslation();

  if (!isVisible) return null;

  const isLoginMessage =
    message.includes("Login required") ||
    message.includes("تسجيل الدخول مطلوب") ||
    message.includes("Please log in") ||
    message.includes("يرجى تسجيل الدخول");
  const isSuccessMessage =
    message.includes("Added") ||
    message.includes("added") ||
    message.includes("Cart added successfully") ||
    message.includes("Product added to favorites") ||
    message.includes("تم إضافة المنتج للمفضلة") ||
    message.includes("Cart updated successfully") ||
    message.includes("تم تحديث السلة بنجاح");
  const isRemoveMessage =
    message.includes("Removed") ||
    message.includes("removed") ||
    message.includes("Favourite updated successfully") ||
    message.includes("Product removed from favorites") ||
    message.includes("تم إزالة المنتج من المفضلة") ||
    message.includes("Favorite updated successfully") ||
    message.includes("تم تحديث المفضلة بنجاح");

  const isCartRemoveMessage =
    message.includes("Cart updated successfully") ||
    message.includes("Product removed from cart") ||
    message.includes("تم إزالة المنتج من السلة") ||
    message.includes("Cart removed successfully") ||
    message.includes("تم حذف السلة بنجاح");
  const isErrorMessage =
    message.includes("Failed") ||
    message.includes("failed") ||
    message.includes("Error") ||
    message.includes("خطأ") ||
    message.includes("فشل") ||
    message.includes("error");

  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1] || "en"
      : "en";

  // تحديد نوع الرسالة والألوان
  let toastStyle = "";
  let iconStyle = "";
  let titleStyle = "";
  let descriptionStyle = "";
  let icon = null;

  if (isLoginMessage) {
    // رسالة تسجيل الدخول - لون برتقالي
    toastStyle = "bg-[#FFF8E1] border-[#FFEFC7]";
    iconStyle = "bg-[#FFEFC7]";
    titleStyle = "text-[#B54708]";
    descriptionStyle = "text-gray-800";
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M9.99965 6.66666V9.99999M9.99965 13.3333H10.008M8.57465 2.38333L1.51632 14.1667C1.37079 14.4187 1.29379 14.7044 1.29298 14.9954C1.29216 15.2864 1.36756 15.5726 1.51167 15.8254C1.65579 16.0783 1.86359 16.2889 2.11441 16.4365C2.36523 16.5841 2.65032 16.6635 2.94132 16.6667H17.058C17.349 16.6635 17.6341 16.5841 17.8849 16.4365C18.1357 16.2889 18.3435 16.0783 18.4876 15.8254C18.6317 15.5726 18.7071 15.2864 18.7063 14.9954C18.7055 14.7044 18.6285 14.4187 18.483 14.1667L11.4247 2.38333C11.2761 2.13841 11.0669 1.93593 10.8173 1.7954C10.5677 1.65487 10.2861 1.58104 9.99965 1.58104C9.71321 1.58104 9.43159 1.65487 9.18199 1.7954C8.93238 1.93593 8.72321 2.13841 8.57465 2.38333Z"
          stroke="#DC6803"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  } else if (isSuccessMessage) {
    // رسالة نجاح الإضافة - لون أخضر
    toastStyle = "bg-green-50 border-green-200";
    iconStyle = "bg-green-100";
    titleStyle = "text-green-800";
    descriptionStyle = "text-gray-800";
    icon = (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#D1FADF" />
        <path
          d="M10 17l4 4 8-8"
          stroke="#12B76A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  } else if (isCartRemoveMessage) {
    // رسالة الحذف من الكارت - لون أحمر مع أيقونة سلة
    toastStyle = "bg-red-50 border-red-200";
    iconStyle = "bg-red-100";
    titleStyle = "text-red-800";
    descriptionStyle = "text-gray-800";
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M2.5 5h15l-1.25 10h-12.5L2.5 5z"
          stroke="#DC2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 5V3.75a1.25 1.25 0 011.25-1.25h2.5a1.25 1.25 0 011.25 1.25V5"
          stroke="#DC2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.75 8.75v3.75"
          stroke="#DC2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.25 8.75v3.75"
          stroke="#DC2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  } else if (isRemoveMessage) {
    // رسالة الإزالة - لون برتقالي مع أيقونة مختلفة
    toastStyle = "bg-[#FFF8E1] border-[#FFEFC7]";
    iconStyle = "bg-[#FFEFC7]";
    titleStyle = "text-[#B54708]";
    descriptionStyle = "text-gray-800";
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M9.99965 6.66666V9.99999M9.99965 13.3333H10.008M8.57465 2.38333L1.51632 14.1667C1.37079 14.4187 1.29379 14.7044 1.29298 14.9954C1.29216 15.2864 1.36756 15.5726 1.51167 15.8254C1.65579 16.0783 1.86359 16.2889 2.11441 16.4365C2.36523 16.5841 2.65032 16.6635 2.94132 16.6667H17.058C17.349 16.6635 17.6341 16.5841 17.8849 16.4365C18.1357 16.2889 18.3435 16.0783 18.4876 15.8254C18.6317 15.5726 18.7071 15.2864 18.7063 14.9954C18.7055 14.7044 18.6285 14.4187 18.483 14.1667L11.4247 2.38333C11.2761 2.13841 11.0669 1.93593 10.8173 1.7954C10.5677 1.65487 10.2861 1.58104 9.99965 1.58104C9.71321 1.58104 9.43159 1.65487 9.18199 1.7954C8.93238 1.93593 8.72321 2.13841 8.57465 2.38333Z"
          stroke="#DC6803"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  } else if (isErrorMessage) {
    // رسالة خطأ - لون أحمر
    toastStyle = "bg-red-50 border-red-200";
    iconStyle = "bg-red-100";
    titleStyle = "text-red-800";
    descriptionStyle = "text-gray-800";
    icon = (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FEE2E2" />
        <path
          d="M16 8v8M16 24h.01"
          stroke="#DC2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // تحديد العنوان والوصف
  let title = message;
  let description = "";

  if (isLoginMessage) {
    title = t("toast.login_required");
    description = t("toast.login_required_desc");
  } else if (isSuccessMessage) {
    if (message.includes("Cart")) {
      title = t("toast.cart_updated");
      description = t("toast.cart_updated");
    } else {
      title = t("toast.favorite_added");
      description = t("toast.favorite_added");
    }
  } else if (isCartRemoveMessage) {
    // عرض الرسالة الراجعة من API مباشرة
    title = message;
    description = t("toast.product_removed");
  } else if (isRemoveMessage) {
    if (message.includes("Favourite updated successfully")) {
      title = t("toast.favorite_removed");
      description = t("toast.favorite_removed");
    } else {
      title = t("toast.favorite_removed");
      description = t("toast.favorite_removed");
    }
  } else if (isErrorMessage) {
    title = t("toast.cart_update_failed");
    description = t("toast.remove_failed");
  }

  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 shadow-lg font-sukar rounded-md transition-all duration-300 ease-in-out ${toastStyle}`}
      style={{ minWidth: 340 }}
    >
      <div
        className={`rounded-md p-2 flex items-center justify-center ${iconStyle}`}
      >
        {icon}
      </div>
      <div>
        <div className={`font-bold mb-0 ${titleStyle}`}>{title}</div>
        <div className={descriptionStyle}>{description}</div>
        {/* {isLoginMessage && (
          <button
            onClick={() => {
              onClose();
              router.push(`/${locale}/login`);
            }}
            className="mt-0 font-bold text-[#B54708] font-sukar"
          >
            Login
          </button>
        )} */}
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  );
}
