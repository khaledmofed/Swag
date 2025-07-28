const fs = require('fs');
const path = require('path');

/**
 * Generate dynamic sitemap entries for blog posts and other dynamic content
 * This script can be extended to fetch from your API or database
 */
async function generateDynamicSitemap() {
  const siteUrl = process.env.SITE_URL || 'https://swaggold.co';
  const locales = ['en', 'ar'];
  
  try {
    // You can fetch blog posts from your API here
    // For now, we'll create a placeholder structure
    const blogPosts = [
      {
        slug: 'gold-investment-guide',
        lastModified: '2024-01-15',
        priority: 0.8
      },
      {
        slug: 'diamond-market-trends',
        lastModified: '2024-01-10',
        priority: 0.8
      },
      {
        slug: 'jewelry-care-tips',
        lastModified: '2024-01-05',
        priority: 0.7
      }
    ];

    // Generate sitemap entries
    const sitemapEntries = [];

    // Add main pages
    const mainPages = [
      { path: '', priority: 1.0, changefreq: 'daily' },
      { path: '/blog', priority: 0.8, changefreq: 'weekly' },
      { path: '/market-insights', priority: 0.9, changefreq: 'daily' },
    ];

    for (const page of mainPages) {
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${siteUrl}/${locale}${page.path}`,
          lastModified: new Date().toISOString(),
          changeFrequency: page.changefreq,
          priority: page.priority,
          alternates: {
            languages: {
              en: `${siteUrl}/en${page.path}`,
              ar: `${siteUrl}/ar${page.path}`,
            }
          }
        });
      }
    }

    // Add blog posts
    for (const post of blogPosts) {
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${siteUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.lastModified,
          changeFrequency: 'weekly',
          priority: post.priority,
          alternates: {
            languages: {
              en: `${siteUrl}/en/blog/${post.slug}`,
              ar: `${siteUrl}/ar/blog/${post.slug}`,
            }
          }
        });
      }
    }

    // Write to a JSON file that can be used by next-sitemap
    const outputPath = path.join(process.cwd(), 'public', 'dynamic-sitemap.json');
    fs.writeFileSync(outputPath, JSON.stringify(sitemapEntries, null, 2));
    
    console.log(`✅ Generated dynamic sitemap with ${sitemapEntries.length} entries`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return sitemapEntries;
  } catch (error) {
    console.error('❌ Error generating dynamic sitemap:', error);
    return [];
  }
}

// Run the script if called directly
if (require.main === module) {
  generateDynamicSitemap();
}

module.exports = { generateDynamicSitemap };
