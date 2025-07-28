"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlogCard from "../common/BlogCard";
import { useTranslation } from "react-i18next";
import { useSystemSettingsWithStore, useBlogsWithStore } from "@/hooks";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LatestBlogs: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const blogRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { getSettingByKey } = useSystemSettingsWithStore({
    enabled: isClient,
  });
  const { data: blogsResponse, isLoading } = useBlogsWithStore({
    per_page: 6,
    enabled: isClient,
  });
  const blogs = blogsResponse?.data?.items || [];
  const { t } = useTranslation();

  const blogPosts = blogs?.map((item: any) => ({
    id: item.id.toString(),
    slug: item.slug,
    date: item.published_at,
    title: item.title,
    description: item.short_description || "",
    image: item.feature_image,
    category: item.tags[0],
    readTime: item.reading_time
      ? `${item.reading_time} min read`
      : "5 min read",
  }));
  console.log("blogsResponse", blogsResponse);

  useEffect(() => {
    if (!isClient || isLoading) {
      return;
    }
    const direction = document.documentElement.dir === "rtl" ? "rtl" : "ltr";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const container = blogRefs.current[0];
      if (!container) return;

      const slideDistance = blogPosts.length * 60;
      const directionMultiplier = direction === "rtl" ? 1 : -1;

      gsap.to(container, {
        x: `${directionMultiplier * slideDistance}vw`,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${blogPosts.length * window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [blogPosts.length, isClient, isLoading]);

  if (!isClient || isLoading) {
    return (
      <section className="py-8 lg:py-24 bg-white dark:bg-secondary-600 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="animate-pulse space-y-8">
            <div className="text-center">
              <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="py-8 lg:py-24 bg-white dark:bg-secondary-600 transition-colors duration-300 relative"
      style={{
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-primary-500  text-lg  mb-4  uppercase">
            {getSettingByKey("LAST_BLOGS_CAPTION")?.value ||
              t("latest_blogs.section_title")}
          </p>
          <h2 className="text-4xl lg:text-6xl font-thin text-secondary-500 dark:text-white-50 mb-6">
            {getSettingByKey("LAST_BLOGS_HEADLINE")?.value ||
              t("latest_blogs.title")}
          </h2>
          <p className="text-md text-secondary-400 dark:text-white-200  mx-auto">
            {getSettingByKey("LAST_BLOGS_RICH_TEXT")?.value ||
              t("latest_blogs.subtitle")}
          </p>
        </div>

        {/* Blog Posts */}
        <div className="relative overflow-hidden">
          <div
            className="flex"
            ref={(el) => {
              blogRefs.current[0] = el;
            }}
            style={{ width: `${blogPosts.length * 100}vw` }}
          >
            {blogPosts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;
