# API System with Zustand and Axios

This document explains how to use the new API system with Zustand stores and Axios for data fetching.

## Overview

The system provides:
- **Lazy Loading**: API calls only happen when components actually use the stores
- **Automatic Language Handling**: API requests include current language headers
- **Token Management**: Automatic token handling for authenticated requests
- **Caching**: Smart caching to avoid unnecessary API calls
- **Error Handling**: Comprehensive error handling and loading states

## Environment Setup

Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=https://admin.swaggold.co
```

## Available Stores

### 1. System Settings Store
```typescript
import { useSystemSettingsStore, useSystemSetting } from '@/stores/systemSettingsStore';

// In component
const siteName = useSystemSetting('site_name'); // Gets specific setting
const { fetchSystemSettings } = useSystemSettingsStore();

useEffect(() => {
  fetchSystemSettings(); // Only fetches when component uses it
}, [fetchSystemSettings]);
```

### 2. Banner Store (Filtered System Settings)
```typescript
import { useHeroBannerData, useBannerStore } from '@/stores/bannerStore';

// In component
const heroBanner = useHeroBannerData();
const { fetchBannerSettings } = useBannerStore();

useEffect(() => {
  fetchBannerSettings(); // Fetches only banner-related settings
}, [fetchBannerSettings]);

// Access structured data
console.log(heroBanner.headline); // "Elegant pure jewelery with quality materials"
console.log(heroBanner.ctaText);  // "Get Started"
```

### 3. Footer Store
```typescript
import { useFooterData, useFooterStore } from '@/stores/footerStore';

const footerData = useFooterData();
const { fetchFooter } = useFooterStore();
```

### 4. Services Store
```typescript
import { useActiveServices, useServicesStore } from '@/stores/servicesStore';

const services = useActiveServices();
const { fetchServices } = useServicesStore();
```

### 5. Categories Store
```typescript
import { useActiveCategories, useCategoriesStore } from '@/stores/categoriesStore';

const categories = useActiveCategories();
const { fetchCategories } = useCategoriesStore();
```

### 6. Blog Store
```typescript
import { useBlogList, useBlogStore } from '@/stores/blogStore';

const blogs = useBlogList();
const { fetchBlogs, fetchBlogBySlug } = useBlogStore();

// Fetch with parameters
fetchBlogs({ per_page: 10, page: 1, category: 'news' });
```

### 7. Live Market Insights Store
```typescript
import {
  useMarketPrices,
  useMarketNews,
  useMarketIndicators,
  useLiveMarketInsightsStore,
  usePriceBySymbol
} from '@/stores/liveMarketInsightsStore';

// In component
const prices = useMarketPrices();
const news = useMarketNews();
const indicators = useMarketIndicators();
const goldPrice = usePriceBySymbol('GOLD');

const {
  fetchLiveMarketInsights,
  startAutoRefresh,
  stopAutoRefresh,
  setRefreshInterval
} = useLiveMarketInsightsStore();

useEffect(() => {
  fetchLiveMarketInsights(); // Only fetches when component uses it

  // Optional: Start auto-refresh
  startAutoRefresh();

  return () => stopAutoRefresh(); // Cleanup
}, [fetchLiveMarketInsights, startAutoRefresh, stopAutoRefresh]);
```

## API Filtering

### System Settings with Key Filters
```typescript
// Fetch only specific settings
const { fetchSystemSettings } = useSystemSettingsStore();

// Filter by key pattern
fetchSystemSettings({ key_filter: 'HERO_BANNER' });

// Get settings by pattern
const bannerSettings = useSystemSettingsStore(state => 
  state.getSettingsByKeyPattern('HERO_BANNER_')
);
```

### Banner Store (Pre-filtered)
The banner store automatically filters and organizes banner-related settings:

```typescript
// Automatically gets HERO_BANNER_*, PROMOTION_BANNER_*, SHOP_NOW_* settings
const heroBanner = useHeroBannerData();
const promotionBanner = usePromotionBannerData();
const shopNowBanner = useShopNowBannerData();
```

## Language Integration

When language changes, all stores automatically refresh:

```typescript
import { useLanguageStore } from '@/stores/languageStore';

const { setLanguage } = useLanguageStore();

// This will trigger API refresh for all stores
setLanguage('ar');
```

## Usage Examples

### Hero Banner Component
```typescript
'use client';

import { useEffect } from 'react';
import { useHeroBannerData, useBannerStore } from '@/stores/bannerStore';

export default function HeroBanner() {
  const heroBanner = useHeroBannerData();
  const { fetchBannerSettings } = useBannerStore();

  useEffect(() => {
    fetchBannerSettings(); // Only fetches when this component is used
  }, [fetchBannerSettings]);

  return (
    <section>
      <h1>{heroBanner.headline}</h1>
      <p>{heroBanner.description}</p>
      <a href={heroBanner.ctaUrl}>{heroBanner.ctaText}</a>
    </section>
  );
}
```

### Services Page
```typescript
'use client';

import { useEffect } from 'react';
import { useActiveServices, useServicesStore } from '@/stores/servicesStore';

export default function ServicesPage() {
  const services = useActiveServices();
  const { fetchServices } = useServicesStore();

  useEffect(() => {
    fetchServices(); // Only fetches when this component is used
  }, [fetchServices]);

  return (
    <div>
      {services.map(service => (
        <div key={service.id}>
          <h2>{service.title}</h2>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Key Features

1. **Lazy Loading**: No automatic API calls - only when components use stores
2. **Smart Caching**: Avoids duplicate requests with configurable cache times
3. **Language Sync**: Automatic API refresh when language changes
4. **Token Handling**: Automatic authorization headers
5. **Error States**: Loading and error states for each store
6. **Type Safety**: Full TypeScript support with proper interfaces

## API Endpoints

- System Settings: `/api/v1/system-settings?visible_only=1&key_filter=PATTERN`
- Footer: `/api/v1/footer`
- Services: `/api/v1/services`
- Categories: `/api/v1/categories`
- Blogs: `/api/v1/blogs?per_page=10&page=1`
- Blog Detail: `/api/v1/blogs/{slug}`
- Live Market Insights: `/api/live-market-insights`

## Internationalized Routing

All pages support locale routing:
- `/en/` - English
- `/ar/` - Arabic
- Automatic redirect from `/` to `/en/`

The middleware handles locale detection and routing automatically.
