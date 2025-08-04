import React from "react";
import { Button } from "@/components/ui/button";
import { cn, getImageUrl } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/stores/languageStore";

interface BlogPost {
  id: string;
  slug: string;
  date: string;
  title: string;
  description: string;
  image: string;
  category: string;
  readTime: string;
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguageStore();

  const handleReadMore = () => {
    router.push(`/blog/${post.slug}`);
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="flex items-center text-nowrap  justify-center h-full max-w-[50px] -rotate-90 absolute">
        <span className={cn(" text-4xl text-primary-500")}>
          {post.category}
        </span>
      </div>
      <div
        key={post.id}
        className="w-screen flex-shrink-0 pr-12 md:px-16 flex flex-col md:flex-row items-start gap-12"
        style={{
          willChange: "transform, opacity",
          transform: "translateZ(0)",
        }}
      >
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <div className="relative overflow-hidden">
            <div className="aspect-[4/3]">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  loading="lazy"
                  src={getImageUrl(post.image)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`w-full lg:w-1/2 space-y-10 m-auto ${
            language === "ar" ? "pl-12" : "pr-12"
          }`}
        >
          <div className="space-y-4">
            <div className="text-lg text-secondary-400 dark:text-gray-300">
              {post.date}
            </div>

            <h3 className="text-2xl lg:text-3xl font-light leading-snug text-secondary-500 dark:text-white-50">
              {post.title}
            </h3>
            {post.description && (
              <div
                className="text-secondary-500 dark:text-white-200 text-md lg:text-lg sukar"
                dangerouslySetInnerHTML={{ __html: post.description }}
              />
            )}
          </div>

          <Button
            onClick={handleReadMore}
            variant={"gradient"}
            className="uppercase px-6 py-2 self-start"
          >
            {t("collection_update.Read_More")}
          </Button>
        </div>
      </div>
    </div>
  );
}
