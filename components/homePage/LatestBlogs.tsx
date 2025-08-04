"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlogCard from "../common/BlogCard";
import { useTranslation } from "react-i18next";
import { useSystemSettingsWithStore, useBlogsWithStore } from "@/hooks";
import { Icon } from "@/components/common/Icon";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LatestBlogs: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const blogRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Navigation functions
  const goToSlide = (slideIndex: number) => {
    if (slideIndex < 0 || slideIndex >= blogPosts.length) return;

    setCurrentSlide(slideIndex);

    const container = blogRefs.current[0];
    if (!container) return;

    const slideDistance = slideIndex * 100;
    // Fix the direction - always move left for next slide
    gsap.to(container, {
      x: `-${slideDistance}vw`,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const nextSlide = () => {
    if (currentSlide < blogPosts.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    if (!isClient || isLoading) {
      return;
    }

    const ctx = gsap.context(() => {
      // Only run the title animation once when component mounts
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          }
        );
      }

      // Initialize first slide position
      const container = blogRefs.current[0];
      if (container) {
        // Always start at position 0
        gsap.set(container, {
          x: "0vw",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isClient, isLoading]); // Removed currentSlide and blogPosts.length dependencies

  // Reset slide position when data changes
  useEffect(() => {
    if (blogPosts.length > 0 && isClient) {
      setCurrentSlide(0);
      const container = blogRefs.current[0];
      if (container) {
        gsap.set(container, {
          x: "0vw",
        });
      }
    }
  }, [blogPosts.length, isClient]);

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
          <p className="text-primary-500  text-lg  mb-0  uppercase">
            {getSettingByKey("LAST_BLOGS_CAPTION")?.value ||
              t("latest_blogs.section_title")}
          </p>
          <h2 className="text-4xl lg:text-6xl font-thin text-secondary-500 dark:text-white-50 mb-0">
            {getSettingByKey("LAST_BLOGS_HEADLINE")?.value ||
              t("latest_blogs.title")}
          </h2>
          <p className="text-base sm:text-lg text-secondary-400 dark:text-white-200 font-body mx-auto">
            {getSettingByKey("LAST_BLOGS_RICH_TEXT")?.value ||
              t("latest_blogs.subtitle")}
          </p>
        </div>

        {/* Blog Posts with Navigation */}
        <div className="relative overflow-hidden">
          {/* Navigation Arrows - Right Side */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute right-16 z-10 w-12 h-12 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous slide"
            style={{ top: "2px" }}
          >
            <Icon
              name="arrow-left"
              size={20}
              className="text-gray-700 dark:text-white"
            />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === blogPosts.length - 1}
            className="absolute right-4 z-10 w-12 h-12 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next slide"
            style={{ top: "2px" }}
          >
            <Icon
              name="arrow-right"
              size={20}
              className="text-gray-700 dark:text-white"
            />
          </button>

          {/* Slides Container */}
          <div
            className="flex"
            ref={(el) => {
              blogRefs.current[0] = el;
            }}
            style={{ width: `${blogPosts.length * 100}vw` }}
          >
            {blogPosts.map((post: any) => (
              <div key={post.id} style={{ width: "100vw", flexShrink: 0 }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>

          {/* Dots Navigation - Left Side */}
          <div
            className="absolute left-4 flex flex-row justify-center items-center gap-2"
            style={{ top: "2px" }}
          >
            {blogPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-1 rounded-full transition-all duration-200 ${
                  currentSlide === index
                    ? "bg-primary-500 scale-125"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;
