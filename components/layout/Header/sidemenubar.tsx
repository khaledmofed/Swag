"use client";

import { useEffect, useRef, useState } from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/common/Icon";
import { useLanguageStore } from "@/stores/languageStore";
import { cn } from "@/lib/utils";
import { useFooterWithStore } from "@/hooks";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  showArrow?: boolean;
  active?: boolean;
  className?: string;
  subItems?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
}

function MenuItem({
  label,
  href = "#",
  active,
  onClick,
  showArrow = true,
  subItems,
  className,
}: MenuItemProps) {
  const { closeSidebar } = useSidebarStore();
  const { isRTL } = useLanguageStore();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // Close sidebar when clicking on a menu item (unless it has sub-items)
    if (!subItems) {
      closeSidebar();
    }
  };

  // If the item has sub-items, render as a dropdown
  if (subItems && subItems.length > 0) {
    return (
      <div>
        <DropdownMenu>
          <DropdownMenuContent
            side={isRTL ? "left" : "right"}
            align={"start"}
            className="w-[420px]"
          >
            {subItems.map((subItem, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  if (subItem.onClick) {
                    subItem.onClick();
                  }
                  closeSidebar();
                }}
                className="cursor-pointer"
              >
                {subItem.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Regular menu item without sub-items
  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-between pr-4 pl-3 py-4 text-secondary-500 dark:text-white-50 hover:text-primary-500 transition-colors duration-200 ",
        active && "text-primary-500",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="">{label} </span>
      </div>
      {showArrow && (
        <Icon
          name={isRTL ? "chevron-left" : "chevron-right"}
          size={20}
          className="text-primary-500 "
        />
      )}
    </a>
  );
}

export function SideMenuBar() {
  const { isOpen, closeSidebar } = useSidebarStore();
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const { t } = useTranslation();
  console.log("SideMenuBar - Store translation:", t("navigation.store"));
  console.log(
    "SideMenuBar - All Categories translation:",
    t("navigation.all_categories")
  );

  const { isRTL, language } = useLanguageStore();
  const { data: footer } = useFooterWithStore();

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeSidebar]);
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href.startsWith("#")) {
      return hash === href;
    }

    return pathname.startsWith(href);
  };
  // Close sidebar on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSidebar();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeSidebar]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-999 transition-opacity duration-300"
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0  h-full w-[420px] p-4 z-50
          bg-white-50 dark:bg-dark-secondary-600
          shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
          ${isRTL ? "right-0" : "left-0"}
          `}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between pr-4 pl-3 pt-4">
          <h2 className="text-sm text-secondary-100">{t("common.close")}</h2>
          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 rounded-lg text-secondary-100
              hover:text-secondary-300 dark:hover:text-slate-100
              transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-4">
            <MenuItem
              label={t("navigation.store")}
              href={`/${language}/store`}
              active={isActive(`/${language}/store`)}
            />
            <MenuItem
              label={t("navigation.all_categories")}
              href={`/${language}/all-categories`}
              active={isActive(`/${language}/all-categories`)}
            />
            <MenuItem
              label={t("navigation.about_us")}
              href={`/${language}/about`}
              active={isActive(`/${language}/about`)}
            />

            {(footer?.quick_links?.links || []).map((link, index) => (
              <MenuItem
                key={index}
                label={link.label}
                href={link.url}
                active={isActive(link.url)}
              />
            ))}

            {/* Separator line */}
            <div className="my-4 border-t border-gray-200 dark:border-slate-700" />
            <MenuItem
              label={t("terms.title")}
              href={`/${language}/terms`}
              active={isActive(`/${language}/terms`)}
            />
            <MenuItem
              label={t("privacy.title")}
              href={`/${language}/privacy`}
              active={isActive(`/${language}/privacy`)}
            />
            {/* {(footer?.legal_links?.links || []).map((link, index) => (
              <MenuItem
                key={index}
                label={link.label}
                href={link.url}
                active={isActive(link.url)}
              />
            ))} */}
          </nav>
        </div>

        {/* Investment Button */}
        <div className="p-6">
          <Button
            variant="gradient"
            type="button"
            className="w-full py-3 px-5
            capitalize
               font-semibold 
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={closeSidebar}
          >
            {t("navigation.invest_now")}
          </Button>
        </div>
      </div>
    </>
  );
}
