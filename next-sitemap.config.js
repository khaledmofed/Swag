/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://swag-jewelry.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/_next/*', '/admin/*'],
  
  // Configure for multilingual site
  alternateRefs: [
    {
      href: process.env.SITE_URL || 'https://swag-jewelry.com',
      hreflang: 'en',
    },
    {
      href: `${process.env.SITE_URL || 'https://swag-jewelry.com'}/ar`,
      hreflang: 'ar',
    },
  ],

  // Transform function to handle locale-based URLs
  transform: async (config, path) => {
    // Skip API routes and internal Next.js paths
    if (path.startsWith('/api/') || path.startsWith('/_next/')) {
      return null;
    }

    // Handle root path
    if (path === '/') {
      return [
        {
          loc: `${config.siteUrl}/en`,
          changefreq: 'daily',
          priority: 1.0,
          lastmod: new Date().toISOString(),
          alternateRefs: [
            {
              href: `${config.siteUrl}/en`,
              hreflang: 'en',
            },
            {
              href: `${config.siteUrl}/ar`,
              hreflang: 'ar',
            },
          ],
        },
        {
          loc: `${config.siteUrl}/ar`,
          changefreq: 'daily',
          priority: 1.0,
          lastmod: new Date().toISOString(),
          alternateRefs: [
            {
              href: `${config.siteUrl}/en`,
              hreflang: 'en',
            },
            {
              href: `${config.siteUrl}/ar`,
              hreflang: 'ar',
            },
          ],
        },
      ];
    }

    // Handle locale-specific paths
    const localeMatch = path.match(/^\/(en|ar)(\/.*)?$/);
    if (localeMatch) {
      const [, locale, subPath = ''] = localeMatch;
      const otherLocale = locale === 'en' ? 'ar' : 'en';
      
      // Set priority based on page type
      let priority = 0.7;
      let changefreq = 'weekly';
      
      if (subPath === '' || subPath === '/') {
        priority = 1.0;
        changefreq = 'daily';
      } else if (subPath.startsWith('/blog')) {
        priority = 0.8;
        changefreq = 'weekly';
      } else if (subPath.startsWith('/market-insights')) {
        priority = 0.9;
        changefreq = 'daily';
      }

      return {
        loc: `${config.siteUrl}${path}`,
        changefreq,
        priority,
        lastmod: new Date().toISOString(),
        alternateRefs: [
          {
            href: `${config.siteUrl}/en${subPath}`,
            hreflang: 'en',
          },
          {
            href: `${config.siteUrl}/ar${subPath}`,
            hreflang: 'ar',
          },
        ],
      };
    }

    // Default handling for other paths
    return {
      loc: `${config.siteUrl}${path}`,
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },

  // Additional paths that might not be automatically discovered
  additionalPaths: async (config) => {
    const result = [];

    // Add main pages for both locales
    const mainPages = [
      '',
      '/blog',
      '/market-insights',
    ];

    const locales = ['en', 'ar'];

    for (const locale of locales) {
      for (const page of mainPages) {
        const otherLocale = locale === 'en' ? 'ar' : 'en';
        
        result.push({
          loc: `${config.siteUrl}/${locale}${page}`,
          changefreq: page === '' ? 'daily' : page === '/market-insights' ? 'daily' : 'weekly',
          priority: page === '' ? 1.0 : page === '/market-insights' ? 0.9 : 0.8,
          lastmod: new Date().toISOString(),
          alternateRefs: [
            {
              href: `${config.siteUrl}/en${page}`,
              hreflang: 'en',
            },
            {
              href: `${config.siteUrl}/ar${page}`,
              hreflang: 'ar',
            },
          ],
        });
      }
    }

    return result;
  },

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://swag-jewelry.com'}/sitemap.xml`,
    ],
  },
};
