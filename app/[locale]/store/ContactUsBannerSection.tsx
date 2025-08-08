"use client";

import { Icon } from "@/components/common/Icon";
import { useTranslation } from "react-i18next";

export function ContactUsBannerSection() {
  const { t } = useTranslation();
  return (
    <section className="w-full flex items-stretch bg-[#f7fafa] dark:bg-[#232b2b] py-0">
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <span className="fontMobile text-2xl md:text-3xl font-en font-normal text-[#607A76] dark:text-gray-100">
            {t("store.contact_banner.title")}
          </span>
        </div>
      </div>
      <div
        className="bg-[#7d8c86] dark:bg-primary-700 flex items-center justify-center"
        style={{ height: "100px", width: "170px" }}
      >
        <button className="w-14 h-14 rounded-full bg-[#f7fafa] dark:bg-[#232b2b] flex items-center justify-center transition hover:scale-105">
          <Icon
            name="arrow-right"
            size={24}
            className="text-[#607A76] dark:text-gray-100"
          />
        </button>
      </div>
    </section>
  );
}
