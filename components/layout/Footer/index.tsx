"use client";

import { useTranslation } from "react-i18next";
import { Icon } from "@/components/common/Icon";
import Logo from "@/components/common/logo";
import { useFooterWithStore } from "@/hooks";
import { useLanguageStore } from "@/stores/languageStore";

export function Footer() {
  const { t } = useTranslation();
  const { data: footer, isLoading } = useFooterWithStore();
  const { language } = useLanguageStore();
  // Don't render footer content during SSR to prevent hydration issues
  if (typeof window === "undefined" || isLoading || !footer) {
    return (
      <footer className="bg-white-50 border-t border-secondary-500 dark:bg-secondary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 pt-8 pb-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </footer>
    );
  }

  const socialLinks = (footer?.social_media_links || []).map((social) => ({
    href: social.url,
    icon: social.type,
  }));

  return (
    <footer className="bg-white-50 border-t dark:bg-secondary-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Info - Left Column (4 columns) */}
          <div className="lg:col-span-5">
            {/* Logo */}
            <div className="mb-6">
              <Logo
                // logo={footer?.logo}
                width={140}
                height={45}
                className="mb-6"
              />
            </div>

            {/* Company Description */}
            <p className="text-gray-600 text-lg mb-8 font-normal font-body">
              {footer?.rich_text_section}
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="text-primary-600 hover:text-primary-400 p-1 bg-blur border border-white-500 dark:border-button-icon-border rounded-sm transition-colors duration-200"
                  aria-label={social.icon}
                >
                  <Icon name={social.icon as any} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Middle Column (3 columns) */}
          <div className="lg:col-span-4 lg:ml-8">
            <h3 className="text-primary-500 font-semibold text-xl mb-6">
              {footer?.quick_links.title}
            </h3>
            <div className="grid grid-cols-2">
              <ul className="space-y-4">
                <li key="store">
                  <a
                    href={`/${language}/store`}
                    className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                  >
                    {t("navigation.store")}
                  </a>
                </li>
                <li key="all_categories">
                  <a
                    href={`/${language}/all-categories`}
                    className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                  >
                    {t("navigation.all_categories")}
                  </a>
                </li>
                <li key="products">
                  <a
                    href={`/${language}/search`}
                    className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                  >
                    {t("footer.products")}
                  </a>
                </li>
                <li key="about">
                  <a
                    href={`/${language}/about`}
                    className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                  >
                    {t("navigation.about_us")}
                  </a>
                </li>

                {/* {footer?.quick_links.links.slice(0, 4).map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))} */}
              </ul>
              {/* <ul className="space-y-4">
                <li key="privacy">
                  <a
                    href={`/${language}/privacy`}
                    className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                  >
                    {t("privacy.title")}
                  </a>
                </li>
                <li key="privacy">
                  <a
                    href={`/${language}/terms`}
                    className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                  >
                    {t("terms.title")}
                  </a>
                </li> */}

              {/* {footer?.quick_links.links.slice(4, 6).map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))} */}
              {/* </ul> */}
            </div>
          </div>

          {/* Legal - Right Column (3 columns) */}
          <div className="lg:col-span-3">
            <h3 className="text-primary-500 font-semibold text-lg mb-6">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-4">
              <li key="privacy">
                <a
                  href={`/${language}/privacy`}
                  className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                >
                  {t("privacy.title")}
                </a>
              </li>
              <li key="privacy">
                <a
                  href={`/${language}/terms`}
                  className="text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                >
                  {t("terms.title")}
                </a>
              </li>
              {/* {footer?.legal_links.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className=" text-black-500 dark:text-gray-600  transition-colors duration-200 text-lg"
                  >
                    {link.label}
                  </a>
                </li>
              ))} */}
            </ul>
          </div>
        </div>

        {/* Copyright */}
      </div>
      <div className="mt-10 py-6 border-t w-full border-white-300 dark:border-secondary-500">
        <div className="text-center">
          <p className="dark:text-secondary-100 text-secondary-500 text-md tracking-wider">
            {footer?.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  );
}
