import React from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

interface PaginationCustomProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  isRTL?: boolean;
}

export const PaginationCustom: React.FC<PaginationCustomProps> = ({
  page,
  totalPages,
  onPageChange,
  className = "",
  isRTL = false,
}) => {
  // Generate page numbers (1,2,3,...,totalPages) with ellipsis
  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page, "...", totalPages];
  };
  const pages = getPages();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-0 mt-10",
        className
      )}
    >
      <div className="flex items-center justify-center gap-4">
        <button
          className="w-8 h-8 flex items-center justify-center text-[18px] font-en transition dark:text-white"
          style={{ color: page === 1 ? "#d1d5db" : "#bfc7c3" }}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <Icon name={isRTL ? "arrow-right" : "arrow-left"} size={22} />
        </button>
        {pages.map((p, i) => (
          <button
            key={i}
            className={`w-8 h-8 flex items-center justify-center font-en text-[18px] transition dark:text-white ${
              page === p
                ? "bg-gradient-to-b from-[#bfc7c3] to-[#7d8c86] text-white"
                : "bg-transparent text-[#222] hover:text-primary-500 dark:text-white"
            }`}
            style={page === p ? { fontWeight: 400 } : { fontWeight: 400 }}
            disabled={typeof p === "string"}
            onClick={() => typeof p === "number" && onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="w-8 h-8 flex items-center justify-center text-[18px] font-en transition dark:text-white"
          style={{ color: page === totalPages ? "#d1d5db" : "#bfc7c3" }}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={22} />
        </button>
      </div>
    </div>
  );
};
