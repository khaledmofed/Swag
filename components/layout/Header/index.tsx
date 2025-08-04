"use client";

import { LanguageToggle } from "@/components/common/LanguageToggle";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { SideMenuBar } from "./sidemenubar";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Icon } from "@/components/common/Icon";
import Logo from "@/components/common/logo";
import { useLanguageStore } from "@/stores/languageStore";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSystemSettingsWithStore } from "@/hooks";
import { useTheme } from "@/stores/themeStore";
import { UserSidebar } from "@/components/common/UserSidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/stores/userStore";
import { useCart } from "@/hooks/api";

const BASE_URL = "https://swag.ivadso.com";

export function Header({
  isBlogDetailsPage = false,
  isLiveMarketInsights = false,
}: {
  isBlogDetailsPage?: boolean;
  isLiveMarketInsights?: boolean;
}) {
  const { t } = useTranslation();
  console.log("Header - Store translation:", t("navigation.store"));

  const { token, profile } = useUserStore();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Debug token state
  useEffect(() => {
    console.log("Header - Token changed:", token);
    console.log("Header - Profile changed:", profile);
    console.log(
      "Header - Token from localStorage:",
      localStorage.getItem("token")
    );
  }, [token, profile]);

  // Force re-render when token changes
  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [token, profile]);

  const fetchFavourites = async () => {
    const res = await axios.get(`${BASE_URL}/api/store/my-favourite`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };
  const { data: cartData } = useCart();
  const { data: favData } = useQuery({
    queryKey: ["favourites", token],
    queryFn: fetchFavourites,
    enabled: !!token,
  });
  const { isRTL, language } = useLanguageStore();
  const { toggleSidebar } = useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();
  const [hash, setHash] = useState("");
  const { getSettingsByKeyPattern, isLoading } = useSystemSettingsWithStore({
    enabled: typeof window !== "undefined",
  });
  const menu = getSettingsByKeyPattern("HEAD_SECTION_MENU_");
  const [ready, setReady] = useState(false);
  const { mode } = useTheme();
  const isStore =
    pathname === "/store" ||
    pathname === "/ar/store" ||
    pathname === "/en/store" ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/ar/search") ||
    pathname.startsWith("/en/search") ||
    pathname === "/all-categories" ||
    pathname === "/ar/all-categories" ||
    pathname === "/en/all-categories" ||
    pathname.startsWith("/category/") ||
    pathname.startsWith("/ar/category/") ||
    pathname.startsWith("/en/category/") ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/ar/products/") ||
    pathname.startsWith("/en/products/") ||
    pathname === "/cart" ||
    pathname === "/ar/cart" ||
    pathname === "/en/cart" ||
    pathname === "/profile" ||
    pathname === "/ar/profile" ||
    pathname === "/en/profile" ||
    pathname === "/en/saved-products" ||
    pathname === "/ar/saved-products" ||
    pathname === "/en/saved-products" ||
    pathname === "/orders" ||
    pathname === "/ar/orders" ||
    pathname === "/en/orders" ||
    pathname === "/about" ||
    pathname === "/ar/about" ||
    pathname === "/en/about" ||
    pathname === "/terms" ||
    pathname === "/ar/terms" ||
    pathname === "/en/terms" ||
    pathname === "/privacy" ||
    pathname === "/ar/privacy" ||
    pathname === "/en/privacy" ||
    pathname === "/addresses" ||
    pathname === "/ar/addresses" ||
    pathname === "/en/addresses";
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const demoSuggestions = [
    "Royal Emerald Ring",
    "Eternal Charm Earrings",
    "Radiance of Hope Necklace",
    "Pearl Earrings",
    "Luxury Watches",
  ];
  const filtered = demoSuggestions.filter((s) =>
    s.toLowerCase().includes(searchValue.toLowerCase())
  );
  const [cartCount, setCartCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateCount = () => {
        // جلب بيانات السلة والمفضلة من الـ API فقط (مثال باستخدام React Query)
        const cart = cartData?.data?.cart || [];
        const count = cart.reduce(
          (sum: any, item: any) => sum + (item.quantity || 0),
          0
        );
        setCartCount(count);
        // Saved products
        const saved = favData?.data?.favorite || [];
        setSavedCount(saved.length);
        console.log("Header - Updated saved count:", saved.length);
      };

      const handleSavedProductsUpdate = (event: any) => {
        if (event.detail && event.detail.count !== undefined) {
          // تحديث فوري من البيانات المرسلة
          setSavedCount(event.detail.count);
          console.log(
            "Header - Immediate update saved count:",
            event.detail.count
          );
        } else {
          // تحديث من API
          updateCount();
        }
      };

      const handleCartUpdate = (event: any) => {
        if (event.detail && event.detail.count !== undefined) {
          // تحديث فوري من البيانات المرسلة
          setCartCount(event.detail.count);
          console.log(
            "Header - Immediate update cart count:",
            event.detail.count
          );
        } else {
          // تحديث من API
          updateCount();
        }
      };

      // تحديث فوري عند تغيير البيانات
      updateCount();

      // إضافة مستمع لتغيير المسار لتحديث العدد
      const handleRouteChange = () => {
        // تحديث فوري من API
        if (token) {
          // جلب البيانات المحدثة من API مباشرة
          fetchFavourites()
            .then((data) => {
              const saved = data?.data?.favorite || [];
              setSavedCount(saved.length);
              console.log(
                "Header - Route change update saved count:",
                saved.length
              );
            })
            .catch((error) => {
              console.error("Error fetching favorites on route change:", error);
            });
        }
      };

      window.addEventListener("storage", updateCount);
      window.addEventListener("cart-updated", handleCartUpdate);
      window.addEventListener(
        "saved-products-updated",
        handleSavedProductsUpdate
      );
      window.addEventListener("popstate", handleRouteChange);

      // Listen for logout event
      const handleLogout = () => {
        setCartCount(0);
        setSavedCount(0);
      };
      window.addEventListener("user-logged-out", handleLogout);

      // Listen for login event
      const handleLogin = () => {
        // Force immediate update of cart and favorites count
        if (token) {
          updateCount();
        }
        // Force re-render
        setForceUpdate((prev) => prev + 1);
      };
      window.addEventListener("user-logged-in", handleLogin);

      // Listen for route change to update favorites count
      const handleFavoritesRouteChange = () => {
        if (token) {
          // تحديث فوري من API عند تغيير المسار
          fetchFavourites()
            .then((data) => {
              const saved = data?.data?.favorite || [];
              setSavedCount(saved.length);
              console.log(
                "Header - Route change update saved count:",
                saved.length
              );
            })
            .catch((error) => {
              console.error("Error fetching favorites on route change:", error);
            });
        }
      };
      window.addEventListener("popstate", handleFavoritesRouteChange);

      return () => {
        window.removeEventListener("storage", updateCount);
        window.removeEventListener("cart-updated", handleCartUpdate);
        window.removeEventListener(
          "saved-products-updated",
          handleSavedProductsUpdate
        );
        window.removeEventListener("popstate", handleFavoritesRouteChange);
        window.removeEventListener("user-logged-out", handleLogout);
        window.removeEventListener("user-logged-in", handleLogin);
      };
    }
  }, [cartData, favData, pathname]);

  // تحديث العدد عند تغيير المسار
  useEffect(() => {
    if (token && typeof window !== "undefined") {
      // تحديث فوري من API عند تغيير المسار
      fetchFavourites()
        .then((data) => {
          const saved = data?.data?.favorite || [];
          setSavedCount(saved.length);
          console.log(
            "Header - Pathname change update saved count:",
            saved.length
          );
        })
        .catch((error) => {
          console.error("Error fetching favorites on pathname change:", error);
        });
    }
  }, [pathname, token]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHash(window.location.hash);
      const handleHashChange = () => setHash(window.location.hash);
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href.startsWith("#")) {
      return hash === href;
    }

    return pathname.startsWith(href);
  };

  // Default menu items to prevent hydration issues
  const defaultMenuItems = [
    {
      id: "store",
      key: "HEAD_SECTION_MENU_HOME",
      value: t("navigation.store"),
    },

    {
      id: "collections",
      key: "HEAD_SECTION_MENU_COLLECTIONS",
      value: t("navigation.collections"),
    },
    {
      id: "about",
      key: "HEAD_SECTION_MENU_ABOUT",
      value: t("navigation.about"),
    },
    {
      id: "market",
      key: "HEAD_SECTION_MENU_MARKET",
      value: t("navigation.market_insights"),
    },
  ];

  const NAV_ITEM_Right_Side = [
    {
      id: menu?.[0]?.id || defaultMenuItems[0].id,
      key: menu?.[0]?.key || defaultMenuItems[0].key,
      href: `/${language}/store`,
      label: t("navigation.store"),
    },
    {
      id: "collections",
      key: "HEAD_SECTION_MENU_COLLECTIONS",
      href: `/${language}/all-categories`,
      label: t("navigation.collections"),
    },
  ];
  const NAV_ITEM_Left_Side = [
    {
      id: menu?.[1]?.id || defaultMenuItems[1].id,
      key: menu?.[1]?.key || defaultMenuItems[1].key,
      href: `/${language}/about`,
      label: menu?.[1]?.value || defaultMenuItems[1].value,
    },

    {
      id: menu?.[3]?.id || defaultMenuItems[3].id,
      key: menu?.[3]?.key || defaultMenuItems[3].key,
      href: `/${language}/market-insights`,
      label: menu?.[3]?.value || defaultMenuItems[3].value,
    },
  ];
  return (
    <header
      className={cn(
        isStore
          ? mode === "dark"
            ? "w-full min-h-30 border-b border-color-dark relative z-40 shadow-sm"
            : "w-full min-h-30 bg-white border-b border-gray-200 relative z-40 shadow-sm"
          : " w-full bg-transparent min-h-30 absolute top-0 z-40",
        isBlogDetailsPage &&
          "relative border-b min-h-20 md:min-h-32 pb-4 dark:border-none",
        isLiveMarketInsights && "min-h-24 md:min-h-32 pb-6 dark:border-none"
      )}
    >
      <div className="ContainerMobile container mx-auto h-full px-3 sm:px-4 lg:px-0 py-3 md:py-6">
        <div className="col-mobile grid grid-cols-3 md:grid-cols-12 gap-2 sm:gap-4">
          <SideMenuBar />

          {/* Sidebar Button - 1 column */}
          <div className="col-span-2 flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={toggleSidebar}
              className={cn(
                isStore
                  ? mode === "dark"
                    ? "p-1.5 sm:p-2 rounded-lg text-primary-50 hover:text-primary-50 hover:bg-gray-800 transition-colors duration-200"
                    : "p-1.5 sm:p-2 rounded-lg text-secondary-500 hover:text-black hover:bg-gray-100 transition-colors duration-200"
                  : "p-1.5 sm:p-2 rounded-lg text-primary-50 hover:text-primary-50 hover:bg-button-background-icon transition-colors duration-200",
                isBlogDetailsPage && "text-secondary-500 dark :text-primary-50"
              )}
              aria-label="Open sidebar"
            >
              <Icon
                name={isRTL ? "arrow-menu-alt-right" : "arrow-menu-alt-left"}
                size={20}
                className="sm:w-6 sm:h-6"
              />
            </button>

            <button
              ref={searchBtnRef}
              className={cn(
                "p-1.5 sm:p-2 flex items-center justify-center transition",
                isStore
                  ? mode === "dark"
                    ? "text-primary-50 hover:text-primary-400"
                    : "text-secondary-500 hover:text-primary-500"
                  : "text-primary-50 hover:text-primary-400"
              )}
              onClick={() => {
                const locale = pathname.split("/")[1];
                router.push(`/${locale ? locale + "/" : ""}search`);
              }}
            >
              <Icon
                name="search"
                size={18}
                className="sm:w-[22px] sm:h-[22px]"
              />
            </button>

            {/* Search Popover */}
            {searchOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 z-40 backdrop-blur-sm"
                  style={{ background: "rgba(0,0,0,0.19)" }}
                  onClick={() => setSearchOpen(false)}
                />
                {/* Popover */}
                <div
                  className="absolute z-50 mt-2 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 top-16 w-full max-w-2xl bg-transparent flex justify-center"
                  style={{ minWidth: 280 }}
                >
                  <div className="w-full">
                    <form
                      className="w-full flex bg-white dark:bg-secondary-700 shadow-lg p-3 gap-0 border border-gray-100 dark:border-secondary-600"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSearchOpen(false);
                        router.push(
                          `/search?query=${encodeURIComponent(searchValue)}`
                        );
                      }}
                    >
                      <input
                        autoFocus
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={t("search.placeholder")}
                        className="flex-1 bg-white dark:bg-secondary-700 px-4 text-lg font-sukar outline-none border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400"
                      />
                      <button
                        type="submit"
                        className="flex items-center justify-center px-6 bg-gradient-to-r from-[#7d8c86] to-[#bfc7c3] text-gray-800 dark:text-white font-sukar text-lg gap-2 h-full min-h-[48px]"
                      >
                        {t("search.button")}
                        <Icon name="search" size={24} />
                      </button>
                    </form>
                    <ul className="mt-2 max-h-56 overflow-y-auto bg-white dark:bg-secondary-700 shadow-lg p-2">
                      {filtered.length ? (
                        filtered.map((s, i) => (
                          <li
                            key={i}
                            className="px-3 py-2 cursor-pointer hover:bg-primary-50 dark:hover:bg-secondary-600 text-gray-700 dark:text-white font-sukar text-base"
                            onClick={() => {
                              setSearchValue(s);
                              setSearchOpen(false);
                            }}
                          >
                            {s}
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-gray-400 font-sukar">
                          {t("search.no_results")}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </>
            )}

            <ThemeToggle isBlogDetailsPage={isBlogDetailsPage} />
            <LanguageToggle
              isBlogDetailsPage={isBlogDetailsPage}
              className={
                isStore
                  ? mode === "dark"
                    ? "text-primary-50"
                    : "text-secondary-500"
                  : ""
              }
            />
          </div>

          {/* Navigation with Logo - 8 columns */}
          <nav className="col-span-8 hidden md:grid grid-cols-5 items-center gap-2 lg:gap-4">
            {/* Right side navigation */}
            {NAV_ITEM_Right_Side.map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.id || item.href || item.label || item.key}
                  href={item.href}
                  className={cn(
                    "text-lg font-medium text-center transition-colors duration-200",
                    isStore
                      ? mode === "dark"
                        ? "text-primary-50 hover:text-primary-400"
                        : "text-secondary-500 hover:text-black"
                      : isActive(item.href)
                      ? "text-primary-400"
                      : "text-primary-50 hover:text-primary-400",
                    isBlogDetailsPage &&
                      "text-secondary-500 dark:text-primary-50 "
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id || item.href || item.label || item.key}
                  href={item.href}
                  className={cn(
                    "text-lg font-medium text-center transition-colors duration-200",
                    isStore
                      ? mode === "dark"
                        ? "text-primary-50 hover:text-primary-400"
                        : "text-secondary-500 hover:text-black"
                      : isActive(item.href)
                      ? "text-primary-400"
                      : "text-primary-50 hover:text-primary-400",
                    isBlogDetailsPage &&
                      "text-secondary-500 dark:text-primary-50 "
                  )}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Logo/Brand - Center */}
            <div className="flex items-center justify-center mt-3 mb-3">
              {isStore ? (
                <Logo
                  width={120}
                  height={40}
                  priority={true}
                  onClick={() => (window.location.href = "/")}
                  className="transition-transform duration-200 hover:scale-105 cursor-pointer lg:w-[140px] lg:h-[45px]"
                  logo={
                    mode === "dark"
                      ? "/images/swag-logo-white.png"
                      : "/images/logo-swag-dark.png"
                  }
                  white={mode === "dark"}
                />
              ) : (
                <Logo
                  width={120}
                  height={40}
                  priority={true}
                  onClick={() => (window.location.href = "/")}
                  className="transition-transform duration-200 hover:scale-105 cursor-pointer lg:w-[140px] lg:h-[45px]"
                  white={!isBlogDetailsPage}
                />
              )}
            </div>

            {/* Left side navigation */}
            {NAV_ITEM_Left_Side.map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.id || item.href || item.label || item.key}
                  href={item.href}
                  className={cn(
                    "text-lg font-medium text-center transition-colors duration-200",
                    isStore
                      ? mode === "dark"
                        ? "text-primary-50 hover:text-primary-400"
                        : "text-secondary-500 hover:text-black"
                      : isActive(item.href)
                      ? "text-primary-400"
                      : "text-primary-50 hover:text-primary-400",
                    isBlogDetailsPage &&
                      "text-secondary-500 dark:text-primary-50 "
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id || item.href || item.label || item.key}
                  href={item.href}
                  className={cn(
                    "text-lg font-medium text-center transition-colors duration-200",
                    isStore
                      ? mode === "dark"
                        ? "text-primary-50 hover:text-primary-400"
                        : "text-secondary-500 hover:text-black"
                      : isActive(item.href)
                      ? "text-primary-400"
                      : "text-primary-50 hover:text-primary-400",
                    isBlogDetailsPage &&
                      "text-secondary-500 dark:text-primary-50 "
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side actions - 3 columns */}
          <div className="col-span-1 md:col-span-2 flex items-center justify-end space-x-1 sm:space-x-2 md:space-x-4 rtl:space-x-reverse">
            {/* Icons group */}
            <div className="flex items-center gap-1 space-x-1 sm:space-x-2 md:space-x-3 rtl:space-x-reverse">
              {token ? (
                // Authenticated user - show user actions
                <>
                  <button
                    className={
                      isStore
                        ? cn(
                            "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition",
                            mode === "dark"
                              ? "bg-button-background-icon text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          )
                        : "p-1 sm:p-2 flex items-center justify-center transition text-primary-50 hover:text-primary-400"
                    }
                    onClick={() => setUserSidebarOpen(true)}
                  >
                    <Icon
                      name="user"
                      size={16}
                      className="sm:w-[18px] sm:h-[18px]"
                    />
                  </button>
                  <button
                    className={
                      isStore
                        ? cn(
                            "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition",
                            mode === "dark"
                              ? "bg-button-background-icon text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          )
                        : "p-1 sm:p-2 flex items-center justify-center transition text-primary-50 hover:text-primary-400"
                    }
                    style={{ position: "relative" }}
                    onClick={() =>
                      router.push(
                        `/${pathname.split("/")[1] || ""}/saved-products`
                      )
                    }
                  >
                    <Icon
                      name="heart"
                      size={16}
                      className="sm:w-[18px] sm:h-[18px]"
                    />
                    {savedCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 text-xs font-bold rounded-full font-sukar flex items-center justify-center shadow !text-gray-800"
                        style={{
                          fontSize: 10,
                          background: "#ccd4d3",
                          minWidth: "18px",
                          minHeight: "18px",
                          fontWeight: "bolder",
                          right: "-8px",
                        }}
                      >
                        {savedCount}
                      </span>
                    )}
                  </button>
                  <button
                    className={
                      isStore
                        ? cn(
                            "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition",
                            mode === "dark"
                              ? "bg-button-background-icon text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          )
                        : "p-1 sm:p-2 flex items-center justify-center transition text-primary-50 hover:text-primary-400"
                    }
                    onClick={() =>
                      router.push(`/${pathname.split("/")[1] || ""}/cart`)
                    }
                    style={{ position: "relative" }}
                  >
                    <Icon
                      name="cart"
                      size={16}
                      className="sm:w-[18px] sm:h-[18px]"
                    />
                    {cartCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 text-xs font-bold rounded-full font-sukar flex items-center justify-center shadow !text-gray-800"
                        style={{
                          fontSize: 10,
                          background: "#ccd4d3",
                          minWidth: "18px",
                          minHeight: "18px",
                          fontWeight: "bolder",
                          right: "-8px",
                        }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                // Non-authenticated user - show login button
                <button
                  className={
                    isStore
                      ? cn(
                          "px-8 py-2 rounded-full flex items-center justify-center transition",
                          mode === "dark"
                            ? "bg-button-background-icon text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        )
                      : "p-1 sm:p-2 flex items-center justify-center transition text-primary-50 hover:text-primary-400"
                  }
                  onClick={() => {
                    const locale = pathname.split("/")[1];
                    router.push(`/${locale ? locale + "/" : ""}login`);
                  }}
                >
                  {t("auth.login")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Logo - Centered below header */}
        <div className="mobile-logo md:hidden flex justify-center items-center border-t border-gray-200 dark:border-gray-700 ">
          {isStore ? (
            <Logo
              width={120}
              height={40}
              priority={true}
              onClick={() => (window.location.href = "/")}
              className="transition-transform duration-200 hover:scale-105 cursor-pointer"
              logo={
                mode === "dark"
                  ? "/images/swag-logo-white.png"
                  : "/images/logo-swag-dark.png"
              }
              white={mode === "dark"}
            />
          ) : (
            <Logo
              width={120}
              height={40}
              priority={true}
              onClick={() => (window.location.href = "/")}
              className="transition-transform duration-200 hover:scale-105 cursor-pointer"
              white={!isBlogDetailsPage}
            />
          )}
        </div>
      </div>
      <UserSidebar
        open={userSidebarOpen}
        onClose={() => setUserSidebarOpen(false)}
      />
    </header>
  );
}
