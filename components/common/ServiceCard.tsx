"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn, getImageUrl } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  image?: string;
  className?: string;
  onClick?: () => void;
}

export function ServiceCard({
  title,
  description,
  image,
  className,
  onClick,
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "group shadow-none rounded-none border-none cursor-pointer transition-all duration-300  hover:-translate-y-1 bg-transparent",
        "overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          {image ? (
            <img
              src={getImageUrl(image)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 min-h-[200px] sm:min-h-[300px] lg:min-h-[432px]"
            />
          ) : (
            // Placeholder with gradient background based on service type
            <div
              className={cn(
                "w-full h-full flex items-center justify-center relative overflow-hidden",
                title.toLowerCase().includes("trading") &&
                  "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900",
                title.toLowerCase().includes("logistics") &&
                  "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900",
                title.toLowerCase().includes("bullion") &&
                  "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900",
                title.toLowerCase().includes("jewelry") &&
                  "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900",
                !title.toLowerCase().includes("trading") &&
                  !title.toLowerCase().includes("logistics") &&
                  !title.toLowerCase().includes("bullion") &&
                  !title.toLowerCase().includes("jewelry") &&
                  "bg-gradient-to-br from-primary-100 to-primary-200 dark:from-slate-600 dark:to-slate-700"
              )}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 border-2 border-current rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-current rounded-full"></div>
                <div className="absolute top-1/2 right-8 w-4 h-4 border-2 border-current rounded-full"></div>
              </div>

              <div
                className={cn(
                  "text-4xl font-bold opacity-60 z-10 relative",
                  title.toLowerCase().includes("trading") &&
                    "text-green-600 dark:text-green-400",
                  title.toLowerCase().includes("logistics") &&
                    "text-blue-600 dark:text-blue-400",
                  title.toLowerCase().includes("bullion") &&
                    "text-yellow-600 dark:text-yellow-400",
                  title.toLowerCase().includes("jewelry") &&
                    "text-purple-600 dark:text-purple-400",
                  !title.toLowerCase().includes("trading") &&
                    !title.toLowerCase().includes("logistics") &&
                    !title.toLowerCase().includes("bullion") &&
                    !title.toLowerCase().includes("jewelry") &&
                    "text-primary-400 dark:text-slate-400"
                )}
              >
                {title.charAt(0)}
              </div>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Content */}
        <div className="py-4 sm:py-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-primary-600 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            {title}
          </h3>
          {description && (
            <div
              className="text-sm sm:text-base text-gray-600 dark:text-slate-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
