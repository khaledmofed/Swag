"use client";

import { cn, getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface JewelryCardProps {
  title: string;
  image?: string;
  className?: string;
  onClick?: () => void;
}

export function JewelryCard({
  title,
  image,
  className,
  onClick,
}: JewelryCardProps) {
  const router = useRouter();
  // تحويل العنوان إلى slug مناسب
  const slug = title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return (
    <div
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:-translate-y-2",
        "flex flex-col items-center text-center",
        className
      )}
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          router.push(`/category/${slug}`);
        }
      }}
    >
      {/* Image Container - No background, no shadow */}
      <div className="relative w-full aspect-square overflow-hidden mb-4">
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // Placeholder with subtle gradient background
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            {/* Jewelry icon placeholder */}
            <div className="text-6xl text-gray-300 dark:text-slate-600">
              {title.toLowerCase().includes("brooch") && "💎"}
              {title.toLowerCase().includes("earring") && "💍"}
              {title.toLowerCase().includes("necklace") && "📿"}
              {title.toLowerCase().includes("bracelet") && "⚪"}
              {title.toLowerCase().includes("ring") && "💍"}
              {!title.toLowerCase().includes("brooch") &&
                !title.toLowerCase().includes("earring") &&
                !title.toLowerCase().includes("necklace") &&
                !title.toLowerCase().includes("bracelet") &&
                !title.toLowerCase().includes("ring") &&
                "💎"}
            </div>
          </div>
        )}

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-gray-950 dark:text-white-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
        {title}
      </h3>
    </div>
  );
}
