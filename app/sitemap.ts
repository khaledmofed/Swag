import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL || 'https://swaggold.co'
  const locales = ['en', 'ar']
  
  const routes: MetadataRoute.Sitemap = []

  // Main pages
  const mainPages = [
    {
      path: '',
      priority: 1.0,
      changeFrequency: 'daily' as const,
    },
    {
      path: '/blog',
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    },
    {
      path: '/market-insights',
      priority: 0.9,
      changeFrequency: 'daily' as const,
    },
  ]

  // Add main pages for each locale
  for (const page of mainPages) {
    for (const locale of locales) {
      routes.push({
        url: `${siteUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${siteUrl}/en${page.path}`,
            ar: `${siteUrl}/ar${page.path}`,
          }
        }
      })
    }
  }

  // Add blog posts (you can fetch these dynamically from your API)
  const blogPosts = [
    'gold-investment-guide',
    'diamond-market-trends', 
    'jewelry-care-tips',
    'precious-metals-analysis',
    'market-outlook-2024'
  ]

  for (const slug of blogPosts) {
    for (const locale of locales) {
      routes.push({
        url: `${siteUrl}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${siteUrl}/en/blog/${slug}`,
            ar: `${siteUrl}/ar/blog/${slug}`,
          }
        }
      })
    }
  }

  return routes
}
