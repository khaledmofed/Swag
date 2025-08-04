import { Metadata } from "next";
import { en } from "@/locales/en";
import { ar } from "@/locales/ar";

export type SupportedLocale = "en" | "ar";

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  locale: SupportedLocale;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

/**
 * Get translations for a specific locale
 */
function getTranslations(locale: SupportedLocale) {
  return locale === "ar" ? ar : en;
}

/**
 * Generate base metadata for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const translations = getTranslations(config.locale);
  const siteConfig = (translations as any).seo?.site || {
    name: "SWAG",
    url: "https://swaggold.co",
    locale: "en_US",
    type: "website",
  };

  const url = config.path
    ? `${siteConfig.url}/${config.locale}${config.path}`
    : `${siteConfig.url}/${config.locale}`;

  const metadata: Metadata = {
    title: config.title,
    description: config.description,
    keywords: config.keywords,

    // Open Graph
    openGraph: {
      title: config.title,
      description: config.description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: config.type || "website",
      images: config.image
        ? [
            {
              url: config.image,
              width: 1200,
              height: 630,
              alt: config.title,
            },
          ]
        : undefined,
      ...(config.type === "article" && {
        publishedTime: config.publishedTime,
        modifiedTime: config.modifiedTime,
        authors: config.author ? [config.author] : undefined,
        section: config.section,
        tags: config.tags,
      }),
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: config.image ? [config.image] : undefined,
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${config.path || ""}`,
        ar: `${siteConfig.url}/ar${config.path || ""}`,
      },
    },
  };

  return metadata;
}

/**
 * Generate metadata for the home page
 */
export function generateHomeMetadata(locale: SupportedLocale): Metadata {
  const translations = getTranslations(locale);
  const seoConfig = (translations as any).seo?.home || {
    title: "SWAG | Premium Bullion & Jewelry Services in Saudi Arabia",
    description:
      "SWAG offers premium bullion trading, logistics, and custom jewelry services in Saudi Arabia. Trusted expertise in precious metals since 2013.",
    keywords:
      "bullion trading, jewelry, precious metals, gold, silver, Saudi Arabia, SWAG, luxury jewelry, investment",
  };

  return generateMetadata({
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    locale,
    path: "",
    image: `${
      (translations as any).seo?.site?.url || "https://swaggold.co"
    }/images/og-home.jpg`,
  });
}

/**
 * Generate metadata for the market insights page
 */
export function generateMarketInsightsMetadata(
  locale: SupportedLocale
): Metadata {
  const translations = getTranslations(locale);
  const seoConfig = (translations as any).seo?.market_insights || {
    title: "Live Gold Prices & Global Market Updates | SWAG Economic Monitor",
    description:
      "Stay updated with real-time gold prices, global market insights, and economic indicators. SWAG's comprehensive market monitoring platform.",
    keywords:
      "gold prices, market insights, economic calendar, precious metals, live prices, market analysis, SWAG",
  };

  return generateMetadata({
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    locale,
    path: "/market-insights",
    image: `${
      (translations as any).seo?.site?.url || "https://swaggold.co"
    }/images/og-market-insights.jpg`,
  });
}

/**
 * Generate metadata for blog detail pages
 */
export function generateBlogDetailMetadata(
  locale: SupportedLocale,
  blogTitle?: string,
  blogDescription?: string,
  blogImage?: string,
  publishedTime?: string,
  modifiedTime?: string,
  author?: string,
  tags?: string[]
): Metadata {
  const translations = getTranslations(locale);
  const seoConfig = (translations as any).seo?.blog_details || {
    title: "Blog Details | Jewelry & Bullion Insights Blog | SWAG",
    description:
      "Explore expert insights on jewelry, bullion trading, and precious metals investment. Educational articles from SWAG's industry experts.",
    keywords:
      "jewelry blog, bullion insights, precious metals, investment advice, SWAG blog, diamond education",
  };

  // Use blog-specific data if available, otherwise fall back to defaults
  const title = blogTitle
    ? `${blogTitle} | ${(translations as any).seo?.site?.name || "SWAG"}`
    : seoConfig.title;

  const description = blogDescription || seoConfig.description;

  return generateMetadata({
    title,
    description,
    keywords: seoConfig.keywords,
    locale,
    path: "/blog",
    image:
      blogImage ||
      `${
        (translations as any).seo?.site?.url || "https://swaggold.co"
      }/images/og-blog.jpg`,
    type: "article",
    publishedTime,
    modifiedTime,
    author,
    section: "Blog",
    tags,
  });
}

/**
 * Generate structured data (JSON-LD) for the organization
 */
export function generateOrganizationStructuredData(locale: SupportedLocale) {
  const translations = getTranslations(locale);
  const siteConfig = (translations as any).seo?.site || {
    name: "SWAG",
    url: "https://swaggold.co",
    locale: "en_US",
    type: "website",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description:
      (translations as any).seo?.home?.description ||
      "SWAG offers premium bullion trading, logistics, and custom jewelry services in Saudi Arabia. Trusted expertise in precious metals since 2013.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressRegion: "Riyadh",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
    sameAs: [
      // Add social media URLs here
    ],
  };
}

/**
 * Generate structured data for articles/blog posts
 */
export function generateArticleStructuredData(
  locale: SupportedLocale,
  title: string,
  description: string,
  publishedTime: string,
  modifiedTime?: string,
  author?: string,
  image?: string,
  url?: string
) {
  const translations = getTranslations(locale);
  const siteConfig = (translations as any).seo?.site || {
    name: "SWAG",
    url: "https://swaggold.co",
    locale: "en_US",
    type: "website",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || `${siteConfig.url}/images/og-blog.jpg`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Person",
      name: author || siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    url: url || siteConfig.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url || siteConfig.url,
    },
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  locale: SupportedLocale,
  breadcrumbs: Array<{ name: string; url: string }>
) {
  const translations = getTranslations(locale);
  const siteConfig = (translations as any).seo?.site || {
    name: "SWAG",
    url: "https://swaggold.co",
    locale: "en_US",
    type: "website",
  };

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
      url: item.url,
      description: item.name,
      image: item.url,
      sameAs: item.url,
      potentialAction: {
        "@type": "NavigateAction",
        target: item.url,
      },
      interactionCount: "1",
      inLanguage: locale,
    })),
  };
}

export function generateAddressesMetadata(locale: SupportedLocale) {
  const isArabic = locale === "ar";
  const translations = getTranslations(locale);
  const siteConfig = (translations as any).seo?.site || {
    name: "SWAG",
    url: "https://swaggold.co",
    locale: "en_US",
    type: "website",
  };

  const url = `${siteConfig.url}/${locale}/addresses`;

  return {
    title: isArabic ? "العناوين - Swag" : "Addresses - Swag",
    description: isArabic
      ? "إدارة عناوين الشحن الخاصة بك في متجر Swag للمجوهرات الفاخرة"
      : "Manage your shipping addresses at Swag luxury jewelry store",
    keywords: isArabic
      ? "عناوين، شحن، إدارة، متجر، مجوهرات، فاخر"
      : "addresses, shipping, management, store, jewelry, luxury",
    openGraph: {
      title: isArabic ? "العناوين - Swag" : "Addresses - Swag",
      description: isArabic
        ? "إدارة عناوين الشحن الخاصة بك في متجر Swag للمجوهرات الفاخرة"
        : "Manage your shipping addresses at Swag luxury jewelry store",
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      alternateLocale: locale === "en" ? "ar" : "en",
      images: [
        {
          url: "/images/logo-swag-dark.png",
          width: 1200,
          height: 630,
          alt: isArabic ? "Swag - العناوين" : "Swag - Addresses",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "العناوين - Swag" : "Addresses - Swag",
      description: isArabic
        ? "إدارة عناوين الشحن الخاصة بك في متجر Swag للمجوهرات الفاخرة"
        : "Manage your shipping addresses at Swag luxury jewelry store",
      images: ["/images/logo-swag-dark.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en/addresses`,
        ar: `${siteConfig.url}/ar/addresses`,
      },
    },
  };
}
