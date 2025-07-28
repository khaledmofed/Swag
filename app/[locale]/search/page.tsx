"use client";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { PromoBanner } from "@/components/homePage/PromoBanner";
import { EnchantingSummerCollectionSection } from "../store/EnchantingSummerCollectionSection";
import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import Link from "next/link";
import { useLanguageStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { ContactUsBannerSection } from "../store/ContactUsBannerSection";
import { ProductFilterSidebar } from "./ProductFilterSidebar";
import { SortBySidebar } from "./SortBySidebar";
import { PaginationCustom } from "@/components/ui/PaginationCustom";
import { ProductCard } from "@/components/common/ProductCard";
import { useTranslation } from "react-i18next";
const demoProducts = [
  {
    title: "Royal Emerald Ring",
    price: "$2500",
    image: "/images/collections/ring1.png",
  },
  {
    title: "Eternal Charm Earrings",
    price: "$2500",
    image: "/images/collections/necklace1.png",
  },
  {
    title: "Radiance of Hope Necklace",
    price: "$2500",
    image: "/images/collections/ring2.png",
  },
  {
    title: "Royal Emerald Ring",
    price: "$2500",
    image: "/images/collections/rings-hero.png",
  },
  {
    title: "Radiance of Hope Necklace",
    price: "$2500",
    image: "/images/collections/earring1.png",
  },
  {
    title: "Eternal Charm Earrings",
    price: "$2500",
    image: "/images/collections/ring2.png",
  },
  {
    title: "Royal Emerald Ring",
    price: "$2500",
    image: "/images/collections/earring1.png",
  },
  {
    title: "Royal Emerald Ring",
    price: "$2500",
    image: "/images/collections/necklace1.png",
  },
  {
    title: "Radiance of Hope Necklace",
    price: "$2500",
    image: "/images/collections/earring1.png",
  },
  {
    title: "Eternal Charm Earrings",
    price: "$2500",
    image: "/images/collections/ring2.png",
  },
  {
    title: "Royal Emerald Ring",
    price: "$2500",
    image: "/images/collections/earring1.png",
  },
  {
    title: "Royal Emerald Ring",
    price: "$2500",
    image: "/images/collections/necklace1.png",
  },
  {
    title: "Radiance of Hope Necklace",
    price: "$2500",
    image: "/images/collections/earring1.png",
  },
  {
    title: "Eternal Charm Earrings",
    price: "$2500",
    image: "/images/collections/ring2.png",
  },
  {
    title: "Royal Emerald Ring",
    price: "$2500",
    image: "/images/collections/earring1.png",
  },
  {
    title: "Royal Emerald Ring",
    price: "$2500",
    image: "/images/collections/necklace1.png",
  },
];
const sidebarLinks = [{ label: t("search.share_jewelry"), href: "#" }];
export default function SearchPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { isRTL } = useLanguageStore();

  const filteredProducts = demoProducts.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const [page, setPage] = useState(1);
  const totalPages = 24;
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Default");

  return (
    <MainLayout>
      {/* <PromoBanner /> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10">
        <div className="flex items-start justify-between min-w-0">
          <h1 className="text-3xl font-en font-light mb-4">
            {t("search.title")}
          </h1>
          {/* Right: Sidebar Links & Button */}
          <aside className="w-full md:w-80 flex flex-col gap-4 md:items-end">
            <nav
              className="flex flex-col gap-2 mb-6 md:mb-8"
              style={{
                letterSpacing: "1px",
              }}
            >
              {sidebarLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base font-en  dark:text-gray-200 hover:text-primary-500 transition flex items-center gap-2"
                >
                  {link.label}
                  <span className="text-lg iconeBehind">
                    <Icon
                      name={isRTL ? "arrow-left" : "arrow-right"}
                      size={16}
                    />
                  </span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>

        {/* Results & Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          {/* Left: Results count and tags */}
          <div>
            <div className="mb-2 md:mb-0 text-gray-500 mb-3 text-lg font-sukar">
              <span className="font-bold text-[#607A76]">
                {t("search.results_count", { count: 56 })}
              </span>
              <span className="ml-1">
                {t("search.results_matching", { query })}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Example filter tags, replace with dynamic if needed */}
              {[
                t("search.filters.large_size"),
                t("search.filters.necklaces"),
                t("search.filters.24k"),
                t("search.filters.gold"),
                t("search.filters.price_range"),
              ].map((tag, i) => (
                <span
                  key={tag}
                  className="flex rounded-none items-center bg-[#F7F9F9] border border-[#E3E7E7] rounded-md px-3 py-1 text-sm text-[#252424] font-sukar font-medium"
                >
                  <button
                    type="button"
                    className="mr-1 text-[#E05B5B] hover:text-red-700 focus:outline-none"
                    aria-label={`Remove ${tag}`}
                  >
                    <Icon name="x" size={14} />
                  </button>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* Right: Sort & Filter buttons */}
          <div className="flex gap-4 min-w-[320px] justify-end">
            <Button
              type="button"
              variant="ghost"
              className="rounded-none bg-[#F7F9F9] border border-[#E3E7E7]   px-6 py-5 text-[#607A76] font-en text-md  flex items-center gap-4 shadow-none hover:bg-[#f0f3f3] transition-all duration-150  justify-center font-semibold font-sukar"
              style={{ boxShadow: "none" }}
              onClick={() => setSortOpen(true)}
            >
              {t("search.sort_by")}
              <Icon name="sort" size={28} className="ml-2" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-none bg-[#F7F9F9] border border-[#E3E7E7]   px-6 py-5 text-[#607A76] font-en text-md  flex items-center gap-4 shadow-none hover:bg-[#f0f3f3] transition-all duration-150 justify-center font-semibold font-sukar"
              style={{ boxShadow: "none" }}
              onClick={() => setFilterOpen(true)}
            >
              {t("search.product_filtering")}
              <Icon name="filter" size={28} className="ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.length ? (
            filteredProducts.map((product, idx) => (
              <ProductCard
                // id={product.id.toString()}
                key={idx}
                title={product.title}
                price={product.price}
                image={product.image}
                slug={product.title.toLowerCase().replace(/\s+/g, "-")}
              />
            ))
          ) : (
            <div className="col-span-4 flex flex-col items-center justify-center py-16">
              <img
                src="/images/not-found.png"
                alt="Not found"
                className="h-48 mb-6 select-none pointer-events-none"
                draggable={false}
              />
              <div
                className="text-center text-[#607A76] font-sukar text-lg font-semibold"
                style={{ letterSpacing: "0.2px" }}
              >
                {t("search.no_results_message")}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <PaginationCustom
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isRTL={isRTL}
        />
      </div>
      <ContactUsBannerSection />
      <ProductFilterSidebar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
      <SortBySidebar
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        selected={sortBy}
        onSelect={setSortBy}
        onApply={() => setSortOpen(false)}
      />
    </MainLayout>
  );
}
