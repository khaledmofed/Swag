import React from "react";
import { Icon } from "@/components/common/Icon";
import { useUserStore } from "@/stores/userStore";
import { useRouter, usePathname } from "next/navigation";

const sidebarItems = [
  { icon: "user", label: "Profile", route: "/profile" },
  { icon: "heart", label: "View Saved Products", route: "/saved-products" },
  { icon: "briefcase", label: "Orders", route: "/orders" },
  // { icon: "home", label: "Addresses", route: "/addresses" },
  // { icon: "shield", label: "Change Password", route: "/change-password" },
  { icon: "log-out", label: "Logout", danger: true },
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
  // Detect locale from path
  const locale = pathname?.split("/")[1] || "";
  return (
    <aside className="w-full md:w-72 bg-white dark:bg-[#2c2c2c] rounded-none border border-gray-200 dark:border-[#353535] p-6 flex flex-col gap-2 min-h-[400px]">
      <div className="mb-0">
        <div className="text-md mb-1">Good Morning</div>
        <div className="font-bold text-lg text-[#607A76] mb-2">
          {profile?.firstName} {profile?.lastName}
        </div>
      </div>
      {sidebarItems.map((item) => (
        <button
          key={item.label}
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
          {item.label}
        </button>
      ))}
    </aside>
  );
}

export default AccountSidebar;
