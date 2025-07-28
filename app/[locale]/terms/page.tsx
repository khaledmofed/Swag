"use client";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { MainLayout } from "@/components/layout/MainLayout";
import { ContactUsBannerSection } from "../store/ContactUsBannerSection";
import { WhyChooseUsSection } from "../store/WhyChooseUsSection";

export default function TermsPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  return (
    <MainLayout>
      {" "}
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
            {t("terms.title")}
          </span>
        </nav>
      </div>
      <div
        className=" py-20 bg-primary-50  dark:bg-secondary-600    py-12 font-sukar"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#607A76] text-center font-sans">
          {t("terms.title")}
        </h1>
        <div className=" bg-opacity-80 rounded-none p-8 max-w-3xl mx-auto text-gray-700 text-lg leading-8">
          {(() => {
            const content = t("terms.content");
            const lines = content
              .split(/\r?\n/)
              .filter((line) => line.trim() !== "");
            const listItems = lines.filter((line) => /^\d+\./.test(line));
            const otherLines = lines.filter((line) => !/^\d+\./.test(line));
            return (
              <>
                {otherLines.map((line, i) => (
                  <p key={"p-" + i} className="mb-4">
                    {line}
                  </p>
                ))}
                {listItems.length > 0 && (
                  <ul className="list-decimal pl-8 mb-4">
                    {listItems.map((line, i) => (
                      <li key={"li-" + i}>{line.replace(/^\d+\.\s*/, "")}</li>
                    ))}
                  </ul>
                )}
              </>
            );
          })()}

          {(() => {
            const content = t("terms.content");
            const lines = content
              .split(/\r?\n/)
              .filter((line) => line.trim() !== "");
            const listItems = lines.filter((line) => /^\d+\./.test(line));
            const otherLines = lines.filter((line) => !/^\d+\./.test(line));
            return (
              <>
                {otherLines.map((line, i) => (
                  <p key={"p-" + i} className="mb-4">
                    {line}
                  </p>
                ))}
                {listItems.length > 0 && (
                  <ul className="list-decimal pl-8 mb-4">
                    {listItems.map((line, i) => (
                      <li key={"li-" + i}>{line.replace(/^\d+\.\s*/, "")}</li>
                    ))}
                  </ul>
                )}
              </>
            );
          })()}
        </div>
      </div>
      <WhyChooseUsSection />
      <ContactUsBannerSection />
    </MainLayout>
  );
}
