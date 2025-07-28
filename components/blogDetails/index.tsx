"use client";

import { useEffect, useState } from "react";
import { useBlogBySlugWithStore, useBlogPopularWithStore } from "@/hooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import NewsItem from "./NewsItem";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface BlogDetailPageProps {
  blogSlug: string;
}

export default function BlogDetailPage({ blogSlug }: BlogDetailPageProps) {
  const { t } = useTranslation();
  const { data: blog } = useBlogBySlugWithStore(blogSlug);
  const itemsPerPage = 15;
  const { data: popularBlogs } = useBlogPopularWithStore(itemsPerPage);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(popularBlogs?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = popularBlogs?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of articles section
    document.getElementById("articles-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-8 text-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-3xl text-secondary-500 dark:text-white-50 sm:max-w-[15em] xl:max-w-[24em] md:text-4xl mb-4">
          {blog?.title}
        </h1>
        <p className="text-primary-500 dark:text-white-200 flex items-center gap-2">
          <span className="text-primary-500 rounded-xl text-md font-bold bg-primary-50 dark:bg-secondary-500 dark:text-white-200 p-2">
            {blog?.tags[0]}
          </span>
          <span className="text-primary-500 text-xl">•</span>
          <span className="text-secondary-400 text-md dark:text-white-200">
            {blog?.published_at
              ? new Date(blog.published_at).toDateString()
              : "Unknown Date"}
          </span>
        </p>
      </div>

      {/* Blog Cover Image */}
      <div className="my-6">
        <div
          className="blog-cover-image text-secondary-500 dark:text-white-200 font-sukar"
          dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
        />
      </div>
      <div id="articles-section" className="flex flex-col gap-6">
        {/* Suggested Articles */}
        <h2 className="text-5xl text-secondary-500 dark:text-white-50">
          {t("blog_details.Articles")}
        </h2>
        <p className="text-primary text-md font-sukar">
          {t("blog_details.Explore")}
        </p>

        {[...(currentItems || [])].map((item: any, index: any) => (
          <div
            key={`${item.id}-${startIndex + index}`}
            className={cn(
              "flex items-start gap-4 mb-6 border-b pb-6",
              index === [...(currentItems || [])].length - 1 &&
                "border-b-0 pb-0"
            )}
          >
            <NewsItem {...item} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis for gaps
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
