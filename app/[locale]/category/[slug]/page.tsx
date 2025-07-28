"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "next/navigation";
import { useState } from "react";
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

const demoTabs = [
  "All",
  "18K Gold Ring",
  "21K Gold Ring",
  "18K Gold Wedding Bands",
  "21K Gold Wedding Bands",
];

export default function CategoryPage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Default");

  // Fetch category data by slug
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategoryBySlug(slug as string);

  // Fetch products by category ID
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProductsByCategory(categoryData?.id || 0, page);

  console.log("productsData", productsData);

  const products = productsData?.products?.data || [];
  const totalPages = productsData?.products?.last_page || 1;
  const totalProducts = productsData?.products?.total || 0;

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
                key={tab}
                className={`text-lg font-sukar transition-colors duration-200 px-0 pb-1 border-b-2  ${
                  activeTab === idx
                    ? "text-[#607A76] font-bold border-[#607A76] border-b-2"
                    : "text-gray-700 dark:text-gray-300 border-transparent hover:text-[#607A76]"
                } bg-transparent outline-none`}
                style={{ minWidth: 0 }}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
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
              Sort By
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
                price={`$${product.price}`}
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
            onPageChange={setPage}
          />
        )}

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
      </div>
      <ContactUsBannerSection />
    </MainLayout>
  );
}
