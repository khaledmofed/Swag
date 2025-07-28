# Sitemap Setup Documentation

## Overview
This project uses multiple approaches to generate comprehensive sitemaps for SEO optimization, supporting both English and Arabic locales with proper hreflang attributes.

## 🛠️ Installed Packages

### next-sitemap
- **Version**: ^4.2.3
- **Purpose**: Generates static sitemaps during build process
- **Configuration**: `next-sitemap.config.js`

## 📁 Files Created

### Configuration Files
1. **`next-sitemap.config.js`** - Main configuration for next-sitemap
2. **`app/sitemap.ts`** - Next.js 13+ native sitemap generation
3. **`app/robots.ts`** - Robots.txt generation
4. **`scripts/generate-sitemap.js`** - Dynamic sitemap generation script

### Environment Variables
- **`.env.example`** - Updated with `SITE_URL` variable

## 🚀 How It Works

### 1. Build-time Generation
When you run `npm run build`, the sitemap is automatically generated:
```bash
npm run build
# This runs: next build && next-sitemap
```

### 2. Manual Generation
Generate sitemap manually:
```bash
npm run sitemap
# This runs: npm run generate-sitemap && next-sitemap
```

### 3. Dynamic Generation Only
Generate dynamic entries only:
```bash
npm run generate-sitemap
```

## 🌐 Multilingual Support

### Supported Locales
- **English (en)**: `/en/` - LTR layout
- **Arabic (ar)**: `/ar/` - RTL layout

### URL Structure
```
https://swaggold.co/
├── /en/ (English)
│   ├── / (Home)
│   ├── /blog/ (Blog listing)
│   ├── /blog/[slug]/ (Blog posts)
│   └── /market-insights/ (Market data)
└── /ar/ (Arabic)
    ├── / (الصفحة الرئيسية)
    ├── /blog/ (المدونة)
    ├── /blog/[slug]/ (مقالات)
    └── /market-insights/ (رؤى السوق)
```

### Hreflang Implementation
Each URL includes alternate language versions:
```xml
<url>
  <loc>https://swaggold.co/en/</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://swaggold.co/en/" />
  <xhtml:link rel="alternate" hreflang="ar" href="https://swaggold.co/ar/" />
</url>
```

## 📊 Priority & Frequency Settings

### Page Priorities
- **Home pages**: 1.0 (highest)
- **Market Insights**: 0.9 (very high)
- **Blog listing**: 0.8 (high)
- **Blog posts**: 0.7-0.8 (medium-high)
- **Other pages**: 0.5-0.7 (medium)

### Update Frequencies
- **Home & Market Insights**: Daily
- **Blog pages**: Weekly
- **Static pages**: Monthly

## 🔧 Configuration Details

### next-sitemap.config.js Features
- ✅ Multilingual support with hreflang
- ✅ Custom priority and frequency settings
- ✅ Automatic robots.txt generation
- ✅ API route exclusion
- ✅ Dynamic path handling
- ✅ Alternate language references

### Environment Variables Required
```env
SITE_URL=https://swaggold.co
```

## 📝 Generated Files

### After Build
```
public/
├── sitemap.xml (Main sitemap)
├── robots.txt (Search engine directives)
└── dynamic-sitemap.json (Dynamic entries cache)
```

### Sitemap Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://swaggold.co/en/</loc>
    <lastmod>2024-01-20T10:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://swaggold.co/en/" />
    <xhtml:link rel="alternate" hreflang="ar" href="https://swaggold.co/ar/" />
  </url>
  <!-- More URLs... -->
</urlset>
```

## 🔄 Dynamic Content Integration

### Blog Posts
The system can automatically include blog posts by:
1. Fetching from your API
2. Reading from database
3. Scanning file system

### Example Integration
```javascript
// In scripts/generate-sitemap.js
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs`);
const blogPosts = await response.json();

for (const post of blogPosts) {
  // Add to sitemap...
}
```

## 🚀 Deployment

### Vercel
Sitemaps are automatically generated during build on Vercel.

### Other Platforms
Ensure the build command includes sitemap generation:
```json
{
  "scripts": {
    "build": "next build && next-sitemap"
  }
}
```

## 🔍 SEO Benefits

### Search Engine Optimization
- ✅ Complete site structure visibility
- ✅ Multilingual content discovery
- ✅ Proper language targeting
- ✅ Update frequency hints
- ✅ Content priority signals

### Google Search Console
Submit your sitemap:
```
https://swaggold.co/sitemap.xml
```

## 🛠️ Maintenance

### Adding New Pages
1. Update `app/sitemap.ts` for static pages
2. Modify `scripts/generate-sitemap.js` for dynamic content
3. Rebuild to regenerate sitemap

### Monitoring
- Check Google Search Console for indexing status
- Monitor sitemap accessibility
- Verify hreflang implementation

## 📚 Resources

- [next-sitemap Documentation](https://github.com/iamvishnusankar/next-sitemap)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Hreflang Implementation](https://developers.google.com/search/docs/specialty/international/localized-versions)
