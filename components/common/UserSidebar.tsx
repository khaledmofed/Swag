import React, { useEffect } from "react";
import { Icon } from "@/components/common/Icon";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useTranslation } from "react-i18next";

export function UserSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { profile, logout, token, loadProfileFromAPI } = useUserStore();
  console.log("Guest User", profile);

  // Load profile from API if token exists but no profile
  useEffect(() => {
    if (token && !profile) {
      loadProfileFromAPI();
    }
  }, [token, profile, loadProfileFromAPI]);

  // Determine locale from pathname (assumes /ar/ or /en/ prefix)
  const locale = pathname?.split("/")[1] || "";

  const handleLogout = () => {
    // Clear all user data
    logout();

    // Clear cart and favorites data from localStorage
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");

    // Clear any other cached data
    if (typeof window !== "undefined") {
      // Clear React Query cache for user-specific data
      // Instead of reload, we'll let the logout event handle the cleanup
      window.dispatchEvent(new CustomEvent("user-logged-out"));
    }

    // Close sidebar
    onClose();

    // Redirect to login page with proper locale
    const locale = pathname?.split("/")[1] || "";
    router.push(`/${locale ? locale + "/" : ""}login`);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex font-sukar">
      {/* Overlay */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 bg-black/20 dark:bg-black/40"
        style={{ background: "rgba(0,0,0,0.19)" }}
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        className="relative ml-auto w-full max-w-[380px] h-full bg-white dark:bg-[#232b2b] shadow-2xl flex flex-col transition-transform duration-300 animate-in slide-in-from-right overflow-hidden font-sukar z-50 border-l border-gray-100 dark:border-gray-800"
        style={{ boxShadow: "0 0 32px 0 rgba(0,0,0,0.10)" }}
      >
        {/* Header: صورة واسم وإيميل */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-[#e6e6e6] to-[#b7d0c7] dark:from-[#232b2b] dark:to-[#3a4a46]">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-[#e6e6e6] flex items-center justify-center mb-2">
            <Icon name="user" size={60} className="text-[#607A76]" />
          </div>
          <div className="text-2xl font-bold mt-2 mb-1">
            {profile
              ? `${profile.firstName} ${profile.lastName}`
              : token
              ? t("common.loading")
              : t("user.guest")}
          </div>
          <div className="text-sm mb-3 tracking-wide">
            {profile?.email ||
              (token ? t("common.loading") : t("user.no_email"))}
          </div>
          <div className="text-xs text-gray-500 mb-3">
            {profile?.phone ||
              (token ? t("common.loading") : t("user.no_phone"))}
          </div>
          <button
            className="w-full max-w-[200px] py-2 bg-gradient-to-r from-primary-500 to-primary-50 text-secondary-500 border border-primary-100 rounded-none font-sukar font-semibold flex items-center justify-center gap-2 mb-2 transition-colors duration-200"
            onClick={() => router.push(`/${locale ? locale + "/" : ""}profile`)}
          >
            <Icon name="edit" size={18} />
            {profile ? t("user.manage_account") : t("auth.login")}
          </button>
        </div>
        {/* Content: قائمة الروابط */}
        <div className="flex-1 overflow-y-auto px-0 py-4 scrollbar-thin scrollbar-thumb-[#d1d5db] dark:scrollbar-thumb-[#444] scrollbar-track-transparent bg-white dark:bg-[#232b2b]">
          <ul className="flex flex-col gap-1 px-2">
            <li>
              <button
                className="w-full flex items-center gap-3 py-3 px-4 text-lg text-[#607A76] dark:text-primary-300 font-sukar font-semibold hover:bg-[#f5f8f7] dark:hover:bg-[#2d3535] rounded-none transition"
                onClick={() =>
                  router.push(`/${locale ? locale + "/" : ""}orders`)
                }
              >
                <Icon name="briefcase" size={22} /> {t("user.orders")}
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-3 py-3 px-4 text-lg text-[#607A76] dark:text-primary-300 font-sukar font-semibold hover:bg-[#f5f8f7] dark:hover:bg-[#2d3535] rounded-none transition"
                onClick={() =>
                  router.push(`/${locale ? locale + "/" : ""}saved-products`)
                }
              >
                <Icon name="heart" size={22} /> {t("user.view_saved_products")}
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-3 py-3 px-4 text-lg text-[#607A76] dark:text-primary-300 font-sukar font-semibold hover:bg-[#f5f8f7] dark:hover:bg-[#2d3535] rounded-none transition"
                onClick={() =>
                  router.push(`/${locale ? locale + "/" : ""}cart`)
                }
              >
                <Icon name="cart" size={22} /> {t("user.shopping_cart")}
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 py-3 px-4 text-lg text-[#607A76] dark:text-primary-300 font-sukar font-semibold hover:bg-[#f5f8f7] dark:hover:bg-[#2d3535] rounded-none transition">
                <Icon name="home" size={22} /> {t("user.addresses")}
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 py-3 px-4 text-lg text-[#607A76] dark:text-primary-300 font-sukar font-semibold hover:bg-[#f5f8f7] dark:hover:bg-[#2d3535] rounded-none transition">
                <Icon name="shield" size={22} /> {t("user.change_password")}
              </button>
            </li>
            <li>
              <div className="flex items-center justify-between py-3 px-4">
                <span className="flex items-center gap-3 text-lg text-[#607A76] dark:text-primary-300 font-sukar font-semibold">
                  <Icon name="settings" size={22} />{" "}
                  {t("user.theme_preferences")}
                </span>
                <Icon name="moon" size={22} />
              </div>
            </li>
            <li>
              <div className="flex items-center justify-between py-3 px-4">
                <span className="flex items-center gap-3 text-lg text-[#607A76] dark:text-primary-300 font-sukar font-semibold">
                  <Icon name="globe" size={22} /> {t("user.language_settings")}
                </span>
                <span className="text-base text-[#607A76] dark:text-primary-300">
                  {t("language.arabic")}{" "}
                  <Icon name="chevron-down" size={18} className="inline ml-1" />
                </span>
              </div>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 py-3 px-4 text-lg text-[#607A76] dark:text-primary-300 font-sukar font-semibold hover:bg-[#f5f8f7] dark:hover:bg-[#2d3535] rounded-none transition">
                <Icon name="life-buoy" size={22} /> {t("user.contact_support")}
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 py-3 px-4 text-lg text-[#607A76] dark:text-primary-300 font-sukar font-semibold hover:bg-[#f5f8f7] dark:hover:bg-[#2d3535] rounded-none transition">
                <Icon name="life-buoy" size={22} /> {t("user.help_center")}
              </button>
            </li>
          </ul>
        </div>
        {/* Footer: زر تسجيل الخروج */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-[#f7fafa] dark:bg-[#232b2b]">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 text-lg font-sukar font-bold text-red-500 bg-[#f7fafa] dark:bg-[#232b2b] rounded-none border border-transparent hover:bg-red-50 dark:hover:bg-[#2d3535] transition"
            onClick={handleLogout}
          >
            <Icon name="log-out" size={22} /> {t("user.logout")}
          </button>
        </div>
      </aside>
    </div>
  );
}
