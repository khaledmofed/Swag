import { Metadata } from 'next'
import { en } from '@/locales/en'
import { ar } from '@/locales/ar'

export type SupportedLocale = 'en' | 'ar'

export interface SEOConfig {
  title: string
  description: string
  keywords: string
  locale: SupportedLocale
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

/**
 * Get translations for a specific locale
 */
function getTranslations(locale: SupportedLocale) {
  return locale === 'ar' ? ar : en
}

/**
 * Generate base metadata for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const translations = getTranslations(config.locale)
  const siteConfig = translations.seo.site

  const url = config.path
    ? `${siteConfig.url}/${config.locale}${config.path}`
    : `${siteConfig.url}/${config.locale}`

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
      type: config.type || 'website',
      images: config.image ? [
        {
          url: config.image,
          width: 1200,
          height: 630,
          alt: config.title,
        }
      ] : undefined,
      ...(config.type === 'article' && {
        publishedTime: config.publishedTime,
        modifiedTime: config.modifiedTime,
        authors: config.author ? [config.author] : undefined,
        section: config.section,
        tags: config.tags,
      }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
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
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteConfig.url}/en${config.path || ''}`,
        'ar': `${siteConfig.url}/ar${config.path || ''}`,
      },
    },
  }

  return metadata
}

/**
 * Generate metadata for the home page
 */
export function generateHomeMetadata(locale: SupportedLocale): Metadata {
  const translations = getTranslations(locale)
  const seoConfig = translations.seo.home

  return generateMetadata({
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    locale,
    path: '',
    image: `${translations.seo.site.url}/images/og-home.jpg`,
  })
}

/**
 * Generate metadata for the market insights page
 */
export function generateMarketInsightsMetadata(locale: SupportedLocale): Metadata {
  const translations = getTranslations(locale)
  const seoConfig = translations.seo.market_insights

  return generateMetadata({
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    locale,
    path: '/market-insights',
    image: `${translations.seo.site.url}/images/og-market-insights.jpg`,
  })
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
  const translations = getTranslations(locale)
  const seoConfig = translations.seo.blog_details

  // Use blog-specific data if available, otherwise fall back to defaults
  const title = blogTitle
    ? `${blogTitle} | ${translations.seo.site.name}`
    : seoConfig.title

  const description = blogDescription || seoConfig.description

  return generateMetadata({
    title,
    description,
    keywords: seoConfig.keywords,
    locale,
    path: '/blog',
    image: blogImage || `${translations.seo.site.url}/images/og-blog.jpg`,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
    section: 'Blog',
    tags,
  })
}

/**
 * Generate structured data (JSON-LD) for the organization
 */
export function generateOrganizationStructuredData(locale: SupportedLocale) {
  const translations = getTranslations(locale)
  const siteConfig = translations.seo.site

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: translations.seo.home.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SA',
      addressRegion: 'Riyadh',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic'],
    },
    sameAs: [
      // Add social media URLs here
    ],
  }
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
  const translations = getTranslations(locale)
  const siteConfig = translations.seo.site

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image || `${siteConfig.url}/images/og-blog.jpg`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author || siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    url: url || siteConfig.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url || siteConfig.url,
    },
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  locale: SupportedLocale,
  breadcrumbs: Array<{ name: string; url: string }>
) {
  const translations = getTranslations(locale)
  const siteConfig = translations.seo.site

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',

    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
      url: item.url,
      description: item.name,
      image: item.url,
      sameAs: item.url,
      potentialAction: {
        '@type': 'NavigateAction',
        target: item.url,
      },
      interactionCount: '1',
      inLanguage: locale,
    })),
  }
}
