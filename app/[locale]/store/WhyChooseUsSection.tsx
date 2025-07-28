"use client";

import { useTranslation } from "react-i18next";

const features = [
  {
    icon: "/images/shop-features/icon1.png",
    label: "Lifetime Complimentary Care",
  },
  {
    icon: "/images/shop-features/icon2.png",
    label: "30-Day Hassle-Free Exchanges",
  },
  {
    icon: "/images/shop-features/icon3.png",
    label: "Free Insured Shipping",
  },
  {
    icon: "/images/shop-features/icon4.png",
    label: "Track-In, Trade-Up, and Resale Options",
  },
];

export function WhyChooseUsSection() {
  const { t } = useTranslation();
  const features = [
    { icon: "/images/shop-features/icon1.png", label: t("store.why_1") },
    { icon: "/images/shop-features/icon2.png", label: t("store.why_2") },
    { icon: "/images/shop-features/icon3.png", label: t("store.why_3") },
    { icon: "/images/shop-features/icon4.png", label: t("store.why_4") },
  ];
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        <h2 className="text-3xl md:text-5xl font-en font-light text-center mb-12">
          {t("store.why_title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0 items-start justify-items-center">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center max-w-xs"
            >
              <img
                src={feature.icon}
                alt=""
                className="w-16 h-16 mb-6 dark:invert"
              />
              <span
                className="font-en text-lg md:text-xl font-light text-black dark:text-white"
                style={{ letterSpacing: "0.2px" }}
              >
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
