"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { PaginationCustom } from "@/components/ui/PaginationCustom";
import { ContactUsBannerSection } from "../../store/ContactUsBannerSection";
import { ProductFilterSidebar } from "../../search/ProductFilterSidebar";
import { SortBySidebar } from "../../search/SortBySidebar";
import { ProductCard } from "@/components/common/ProductCard";
import {
  useCategoryBySlug,
  useProductsByCategory,
} from "@/hooks/api/useCategoryProducts";
import { useProductSearch } from "@/hooks/api/useProductSearch";

const demoTabs = [
  { id: "all", label: "All", metal: null, karat: null },
  { id: "18k-gold", label: "18K Gold", metal: "gold", karat: "18" },
  { id: "21k-gold", label: "21K Gold", metal: "gold", karat: "21" },
  { id: "22k-gold", label: "22K Gold", metal: "gold", karat: "22" },
  { id: "24k-gold", label: "24K Gold", metal: "gold", karat: "24" },
  { id: "silver", label: "Silver", metal: "silver", karat: null },
  { id: "platinum", label: "Platinum", metal: "platinum", karat: null },
];

export default function CategoryPage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [searchParams, setSearchParams] = useState({
    category: 0,
    metal: null as string | null,
    karat: null as string | null,
    page: 1,
    name: undefined as string | undefined,
    gender: undefined as string | undefined,
    occasion: undefined as string | undefined,
    weight: undefined as number | undefined,
    price_from: undefined as number | undefined,
    price_to: undefined as number | undefined,
    order: undefined as string | undefined,
    orderby: undefined as string | undefined,
  });
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const handleFilterApply = (filters: any) => {
    setSearchParams((prev) => ({
      ...prev,
      name: filters.name || undefined,
      karat: filters.karat || undefined,
      metal: filters.metal || undefined,
      gender: filters.gender || undefined,
      occasion: filters.occasion || undefined,
      weight: filters.weight || undefined,
      price_from: filters.price_from || undefined,
      price_to: filters.price_to || undefined,
      page: 1,
    }));
    setPage(1);
  };

  // دالة مساعدة للحصول على معاملات الترتيب
  const getSortOptions = () => [
    { value: "default", label: "Default", order: "", orderby: "" },
    { value: "newest", label: "Newest", order: "created_at", orderby: "desc" },
    { value: "oldest", label: "Oldest", order: "created_at", orderby: "asc" },
    {
      value: "highest_price",
      label: "Highest Price",
      order: "price",
      orderby: "desc",
    },
    {
      value: "lowest_price",
      label: "Lowest Price",
      order: "price",
      orderby: "asc",
    },
    // {
    //   value: "highest_rated",
    //   label: "Highest Rated",
    //   order: "rate",
    //   orderby: "desc",
    // },
    // {
    //   value: "lowest_rated",
    //   label: "Lowest Rated",
    //   order: "rate",
    //   orderby: "asc",
    // },
  ];

  const handleSortApply = (sortValue: string) => {
    try {
      // محاولة تحليل JSON إذا كان القيمة تحتوي على معاملات متعددة
      const sortParams = JSON.parse(sortValue);

      console.log("Category - Sort Params:", sortParams);

      setSearchParams((prev) => ({
        ...prev,
        order: sortParams.order || undefined,
        orderby: sortParams.orderby || undefined,
        page: 1,
      }));
    } catch {
      // إذا فشل التحليل، استخدم القيمة القديمة
      const sortOptions = getSortOptions();
      const selectedSort = sortOptions.find((opt) => opt.value === sortValue);

      setSearchParams((prev) => ({
        ...prev,
        order: selectedSort?.order || undefined,
        orderby: selectedSort?.orderby || undefined,
        page: 1,
      }));
    }
    setPage(1);
  };

  const getCurrentSortLabel = () => {
    if (!searchParams.order || !searchParams.orderby) return "Sort By";

    const sortOptions = getSortOptions();
    const found = sortOptions.find((opt) => opt.order === searchParams.order);

    if (!found) return "Sort By";

    const orderByText = searchParams.orderby === "asc" ? " (A-Z)" : " (Z-A)";
    return found.label + orderByText;
  };

  const getCurrentSortValue = () => {
    if (!searchParams.order || !searchParams.orderby) return "default";

    const sortOptions = getSortOptions();
    const found = sortOptions.find(
      (opt) =>
        opt.order === searchParams.order && opt.orderby === searchParams.orderby
    );

    console.log("Current searchParams:", searchParams);
    console.log("Found option:", found);

    if (!found) return "default";

    // إرجاع JSON string يحتوي على كلا القيمتين
    return JSON.stringify({
      order: searchParams.order,
      orderby: searchParams.orderby,
    });
  };

  // Fetch category data by slug
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategoryBySlug(slug as string);

  // Update search params when category changes
  useEffect(() => {
    if (categoryData?.id) {
      setSearchParams((prev) => ({
        ...prev,
        category: categoryData.id,
      }));
    }
  }, [categoryData?.id]);

  // مراقبة تغييرات searchParams
  useEffect(() => {
    console.log("Search Params Updated:", searchParams);
  }, [searchParams]);

  // Fetch products using search API
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProductSearch({
    category: searchParams.category,
    metal: searchParams.metal || undefined,
    karat: searchParams.karat || undefined,
    name: searchParams.name,
    gender: searchParams.gender,
    occasion: searchParams.occasion,
    weight: searchParams.weight?.toString(),
    price_from: searchParams.price_from?.toString(),
    price_to: searchParams.price_to?.toString(),
    order: searchParams.order,
    orderby: searchParams.orderby,
    page,
  });

  const products = productsData?.data?.products?.data || [];
  const totalPages = productsData?.data?.products?.last_page || 1;
  const totalProducts = productsData?.data?.products?.total || 0;

  console.log("productsData", productsData);
  console.log("searchParams", searchParams);
  console.log("products", products);

  // Loading state
  if (categoryLoading || productsLoading) {
    return (
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
    );
  }

  // Error state
  if (categoryError) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Category
            </h1>
            <p className="text-gray-600 mb-4">{categoryError.message}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!categoryData) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600">
              The category you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-0 border-b border-gray-200 dark:border-color-dark">
        {/* Breadcrumb */}
        <nav
          className="flex items-center justify-center text-gray-400 text-md my-4 font-sukar"
          aria-label="Breadcrumb"
        >
          <a href="/store" className="hover:text-primary-500 transition">
            Store
          </a>
          <span className="mx-2">&gt;</span>
          <a
            href="/all-categories"
            className="hover:text-primary-500 transition"
          >
            Categories
          </a>
          <span className="mx-2">&gt;</span>
          <span className="text-primary-600 font-semibold">
            {categoryData?.name}
          </span>
        </nav>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-10">
        <h1 className="text-3xl font-en font-light mb-2 capitalize">
          {categoryData.name} Section
        </h1>
        <div className="mb-4 text-gray-500 text-lg font-sukar">
          <span className="font-bold text-[#607A76]">
            {totalProducts} products
          </span>
          <span className="ml-1">
            matching your selected criteria were found.
          </span>
        </div>

        {/* Tabs & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="flex gap-8 flex-wrap">
            {demoTabs.map((tab, idx) => (
              <button
                key={tab.id}
                className={`text-lg font-sukar transition-colors duration-200 px-0 pb-1 border-b-2  ${
                  activeTab === idx
                    ? "text-[#607A76] font-bold border-[#607A76] border-b-2"
                    : "text-gray-700 dark:text-gray-300 border-transparent hover:text-[#607A76]"
                } bg-transparent outline-none`}
                style={{ minWidth: 0 }}
                onClick={() => {
                  setActiveTab(idx);
                  setSearchParams((prev) => ({
                    ...prev,
                    category: categoryData?.id || 0,
                    metal: tab.metal,
                    karat: tab.karat,
                    page: 1,
                  }));
                  setPage(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right: Sort & Filter buttons */}
          <div className="flex gap-4 min-w-[320px] justify-end">
            <Button
              type="button"
              variant="ghost"
              className="rounded-none bg-[#F7F9F9] border border-[#E3E7E7] px-6 py-5 text-[#607A76] font-en text-md flex items-center gap-4 shadow-none hover:bg-[#f0f3f3] transition-all duration-150 justify-center font-semibold font-sukar"
              style={{ boxShadow: "none" }}
              onClick={() => setSortOpen(true)}
            >
              {getCurrentSortLabel()}
              <Icon name="sort" size={28} className="ml-2" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-none bg-[#F7F9F9] border border-[#E3E7E7] px-6 py-5 text-[#607A76] font-en text-md flex items-center gap-4 shadow-none hover:bg-[#f0f3f3] transition-all duration-150 justify-center font-semibold font-sukar"
              style={{ boxShadow: "none" }}
              onClick={() => setFilterOpen(true)}
            >
              Product Filtering
              <Icon name="filter" size={28} className="ml-2" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                title={product.name}
                price={
                  product.final_price
                    ? Number(product.final_price).toLocaleString()
                    : product.price
                }
                image={product.image}
                isNew={product.featured === 1}
                slug={product.slug}
                id={product.id.toString()}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
            {productsError && (
              <p className="text-red-500 text-sm mt-2">
                Error: {productsError.message}
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationCustom
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              setSearchParams((prev) => ({
                ...prev,
                page: newPage,
              }));
            }}
          />
        )}

        <ProductFilterSidebar
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={handleFilterApply}
          currentFilters={searchParams}
        />
        <SortBySidebar
          open={sortOpen}
          onClose={() => setSortOpen(false)}
          selected={getCurrentSortValue()}
          onSelect={(val) => handleSortApply(val)}
          onApply={() => setSortOpen(false)}
        />
      </div>
      <ContactUsBannerSection />
    </MainLayout>
  );
}
