"use client";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { PromoBanner } from "@/components/homePage/PromoBanner";
import { EnchantingSummerCollectionSection } from "../store/EnchantingSummerCollectionSection";
import { useState, Suspense, useEffect } from "react";
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
import { useProductSearch } from "@/hooks/api/useProductSearch";

function SearchContent() {
  const { t } = useTranslation();
  const sidebarLinks = [{ label: t("search.share_jewelry"), href: "#" }];
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { isRTL } = useLanguageStore();

  // State for search parameters
  const [searchParamsState, setSearchParamsState] = useState({
    name: query,
    category: undefined as number | undefined,
    price_from: "",
    price_to: "",
    karat: "" as string | undefined,
    gender: "",
    metal: "" as string | undefined,
    order: "" as string | undefined,
    orderby: "" as string | undefined,
    page: 1,
  });

  // Update search params when query changes
  useEffect(() => {
    setSearchParamsState((prev) => ({
      ...prev,
      name: query,
      page: 1,
    }));
  }, [query]);

  // Fetch products using search API
  const {
    data: productsData,
    isLoading,
    error,
  } = useProductSearch(searchParamsState);

  const products = productsData?.data?.products?.data || [];
  const totalPages = productsData?.data?.products?.last_page || 1;
  const currentPage = productsData?.data?.products?.current_page || 1;
  const totalItems = productsData?.data?.products?.total || 0;

  // Debug logging
  useEffect(() => {
    console.log("Search - Search Params State:", searchParamsState);
    console.log("Search - Products Data:", productsData);
    console.log("Search - Products:", products);
    console.log("Search - Total Items:", totalItems);
  }, [searchParamsState, productsData, products, totalItems]);

  // Update active tab based on current filters
  useEffect(() => {
    const currentMetal = searchParamsState.metal;
    const currentKarat = searchParamsState.karat;

    const activeTabIndex = demoTabs.findIndex(
      (tab) => tab.metal === currentMetal && tab.karat === currentKarat
    );

    if (activeTabIndex !== -1) {
      setActiveTab(activeTabIndex);
    }
  }, [searchParamsState.metal, searchParamsState.karat]);

  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Default");
  const [activeTab, setActiveTab] = useState(0);

  // Tabs configuration for search page
  const demoTabs = [
    { id: "all", label: t("category.tabs.all"), metal: null, karat: null },
    {
      id: "18k-gold",
      label: t("category.tabs.gold_18k"),
      metal: "gold",
      karat: "18",
    },
    {
      id: "21k-gold",
      label: t("category.tabs.gold_21k"),
      metal: "gold",
      karat: "21",
    },
    {
      id: "24k-gold",
      label: t("category.tabs.gold_24k"),
      metal: "gold",
      karat: "24",
    },
    {
      id: "silver",
      label: t("filter_sidebar.metals.silver"),
      metal: "silver",
      karat: null,
    },
    {
      id: "platinum",
      label: t("filter_sidebar.metals.platinum"),
      metal: "platinum",
      karat: null,
    },
  ];

  // Update page in search params
  useEffect(() => {
    setSearchParamsState((prev) => ({
      ...prev,
      page: page,
    }));
  }, [page]);

  // Handle filter apply
  const handleFilterApply = (filters: any) => {
    setSearchParamsState((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
    setPage(1);
  };

  // Handle sort apply
  const handleSortApply = (sortValue: string) => {
    try {
      // محاولة تحليل JSON إذا كان القيمة تحتوي على معاملات متعددة
      const sortParams = JSON.parse(sortValue);

      console.log("Search - Sort Params:", sortParams);

      setSearchParamsState((prev) => ({
        ...prev,
        order: sortParams.order || undefined,
        orderby: sortParams.orderby || undefined,
        page: 1,
      }));
    } catch {
      // إذا فشل التحليل، استخدم القيمة القديمة
      const sortOptions = getSortOptions();
      const selectedSort = sortOptions.find((opt) => opt.value === sortValue);

      setSearchParamsState((prev) => ({
        ...prev,
        order: selectedSort?.order || undefined,
        orderby: selectedSort?.orderby || undefined,
        page: 1,
      }));
    }
    setPage(1);
  };

  // Get sort options
  const getSortOptions = () => [
    {
      value: "default",
      label: t("sort_sidebar.sort_options.default"),
      order: "",
      orderby: "",
    },
    {
      value: "newest",
      label: t("sort_sidebar.sort_options.newest"),
      order: "created_at",
      orderby: "desc",
    },
    {
      value: "oldest",
      label: t("sort_sidebar.sort_options.oldest"),
      order: "created_at",
      orderby: "asc",
    },
    {
      value: "highest_price",
      label: t("sort_sidebar.sort_options.highest_price"),
      order: "price",
      orderby: "desc",
    },
    {
      value: "lowest_price",
      label: t("sort_sidebar.sort_options.lowest_price"),
      order: "price",
      orderby: "asc",
    },
  ];

  // Get current sort label
  const getCurrentSortLabel = () => {
    if (!searchParamsState.order || !searchParamsState.orderby)
      return t("sort_sidebar.title");

    const sortOptions = getSortOptions();
    const found = sortOptions.find(
      (opt) =>
        opt.order === searchParamsState.order &&
        opt.orderby === searchParamsState.orderby
    );

    if (!found) return t("sort_sidebar.title");

    return found.label;
  };

  // Get current sort value
  const getCurrentSortValue = () => {
    if (!searchParamsState.order || !searchParamsState.orderby)
      return "default";

    const sortOptions = getSortOptions();
    const found = sortOptions.find(
      (opt) =>
        opt.order === searchParamsState.order &&
        opt.orderby === searchParamsState.orderby
    );

    if (!found) return "default";

    // إرجاع JSON string يحتوي على كلا القيمتين
    return JSON.stringify({
      order: searchParamsState.order,
      orderby: searchParamsState.orderby,
    });
  };

  // Handle tab change
  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    const tab = demoTabs[idx];
    setSearchParamsState((prev) => ({
      ...prev,
      metal: tab.metal || undefined,
      karat: tab.karat || undefined,
      page: 1,
    }));
    setPage(1);
  };

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
          {/* Left: Results count */}
          <div>
            <div className="mb-2 md:mb-0 text-gray-500 mb-3 text-lg font-sukar">
              <span className="font-bold text-[#607A76]">
                {t("search.results_count", { count: totalItems })}
              </span>
              <span className="ml-1">
                {t("search.results_matching", { query })}
              </span>
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
              {getCurrentSortLabel()}
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

        {/* Tabs */}
        <div className="flex gap-8 flex-wrap mb-6">
          {demoTabs.map((tab, idx) => (
            <button
              key={tab.id}
              className={`text-lg font-sukar transition-colors duration-200 px-0 pb-1 border-b-2  ${
                activeTab === idx
                  ? "text-[#607A76] font-bold border-[#607A76] border-b-2"
                  : "text-gray-700 dark:text-gray-300 border-transparent hover:text-[#607A76]"
              } bg-transparent outline-none`}
              style={{ minWidth: 0 }}
              onClick={() => handleTabChange(idx)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            // Loading skeleton
            [...Array(8)].map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-1"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))
          ) : products.length ? (
            products.map((product: any, idx: number) => (
              <ProductCard
                key={product.id || idx}
                title={product.name}
                price={product.price} // سيتم استبداله بالسعر المحسوب
                image={product.image}
                isNew={product.featured === 1}
                slug={product.slug}
                id={product.id.toString()}
                karat={product.karat || undefined}
                metal={product.metal || undefined}
                weight={product.weight}
                manufacturingCost={Number(product.price) || 0}
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
        {totalPages > 1 && (
          <PaginationCustom
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            isRTL={isRTL}
          />
        )}
      </div>
      <ContactUsBannerSection />
      <ProductFilterSidebar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterApply}
        currentFilters={searchParamsState}
      />
      <SortBySidebar
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        selected={getCurrentSortValue()}
        onSelect={setSortBy}
        onApply={() => {
          handleSortApply(sortBy);
          setSortOpen(false);
        }}
      />
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded mb-8 w-1/2"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded mb-1"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MainLayout>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
