import React from "react";
import { Icon } from "@/components/common/Icon";
import { useUserStore } from "@/stores/userStore";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

type SidebarItem = {
  icon: string;
  key: string;
  label: string; // إضافة حقل label للاستخدام في المقارنة
  route?: string;
  danger?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    icon: "user",
    key: "user.manage_account",
    label: "Profile",
    route: "/profile",
  },
  {
    icon: "heart",
    key: "user.view_saved_products",
    label: "View Saved Products",
    route: "/saved-products",
  },
  { icon: "briefcase", key: "user.orders", label: "Orders", route: "/orders" },
  {
    icon: "home",
    key: "addresses.title",
    label: "Addresses",
    route: "/addresses",
  },
  // { icon: "shield", key: "user.change_password", label: "Change Password", route: "/change-password" },
  { icon: "log-out", key: "user.logout", label: "Logout", danger: true },
];

export function AccountSidebar({
  activeItem,
  onMenuClick,
}: {
  activeItem: string;
  onMenuClick?: (item: string) => void;
}) {
  const { profile } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  console.log("activeItem", activeItem);
  console.log("item.key", sidebarItems[0].key);
  console.log("t(item.key)", t(sidebarItems[0].key));

  // Detect locale from path
  const locale = pathname?.split("/")[1] || "";
  return (
    <aside className="w-full md:w-72 bg-white dark:bg-[#2c2c2c] rounded-none border border-gray-200 dark:border-[#353535] p-6 flex flex-col gap-2 min-h-[400px]">
      <div className="mb-0">
        <div className="text-md mb-1">{t("common.welcome")}</div>
        <div className="font-bold text-lg text-[#607A76] mb-2">
          {profile?.firstName} {profile?.lastName}
        </div>
      </div>
      {sidebarItems.map((item) => (
        <button
          key={item.key}
          className={`flex items-center gap-3 px-4 py-3 rounded transition text-lg font-sukar font-semibold text-left ${
            activeItem === item.label
              ? "bg-[#607A76] text-white dark:bg-primary-700 dark:text-white"
              : item.danger
              ? "text-red-500 hover:bg-red-50 dark:hover:bg-[#2d3535]"
              : "text-[#607A76] dark:text-primary-300 bg-[#f9f9fa] dark:bg-[#2f2f2f] hover:bg-[#e9ecec] dark:hover:bg-[#2d3535]"
          }`}
          onClick={() => {
            if (item.route) {
              router.push(
                `/${locale ? locale + "/" : ""}${item.route.replace(/^\//, "")}`
              );
            }
            if (onMenuClick) onMenuClick(item.label);
          }}
        >
          <Icon name={item.icon as any} size={22} />
          {t(item.key)}
        </button>
      ))}
    </aside>
  );
}

export default AccountSidebar;
