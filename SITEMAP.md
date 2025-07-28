# SWAG Project Sitemap

## Project Overview
**SWAG** is a multilingual (English/Arabic) jewelry and bullion trading platform built with Next.js 15, featuring RTL/LTR support, dark/light themes, and comprehensive market insights.

## 🌐 Public Pages Structure

### Root Domain Structure
```
https://domain.com/
├── /en/ (English)
│   ├── / (Home Page)
│   ├── /blog/ (Blog Listing)
│   ├── /blog/[slug]/ (Individual Blog Posts)
│   └── /market-insights/ (Market Analysis & Trading Data)
└── /ar/ (Arabic - RTL)
    ├── / (الصفحة الرئيسية)
    ├── /blog/ (المدونة)
    ├── /blog/[slug]/ (مقالات المدونة)
    └── /market-insights/ (رؤى السوق)
```

### Page Details

#### 🏠 Home Page (`/[locale]/`)
- **Purpose**: Main landing page showcasing jewelry collections and services
- **Key Sections**:
  - Hero Video Banner (full-width)
  - Promotional Scrolling Banner
  - What We Offer (Services)
  - Attractive Jewellery Collection
  - Collection Update Section
  - Discover Section
  - Latest Blogs Preview
  - Company Story Section
  - Footer Banner with CTA

#### 📝 Blog Section (`/[locale]/blog/`)
- **Blog Listing Page**: Displays all blog posts with pagination
- **Individual Blog Posts** (`/[locale]/blog/[slug]/`): Dynamic blog content
- **Features**:
  - GSAP scroll animations
  - Full-width responsive layout
  - Content focused on diamonds, jewelry, investment, and lifestyle

#### 📊 Market Insights (`/[locale]/market-insights/`)
- **Purpose**: Financial data and market analysis for trading
- **Components**:
  - Live Price Widgets
  - TradingView Market Overview
  - Economic Calendar Widget
  - Chart Widgets
  - Latest News Integration
  - Real-time market data

## 🔧 API Endpoints

### News & Market Data APIs
```
/api/
├── /breaking-news/ (GET) - Latest breaking news
├── /calendar/ (GET) - Economic calendar events
├── /commodities-news/ (GET) - Commodities market news
├── /currencies-news/ (GET) - Currency market updates
└── /stock-news/ (GET) - Stock market news
```

## 🧩 Component Architecture

### Layout Components
```
components/layout/
├── Header/
│   ├── index.tsx (Main header with navigation)
│   └── sidemenubar.tsx (Mobile sidebar menu)
├── Footer/
│   └── index.tsx (Footer with links and info)
└── MainLayout.tsx (Overall page wrapper)
```

### Navigation Structure
**Main Navigation Items** (from sidebar menu):
- Home
- About
- Services  
- Market Insights
- Blog
- Contact

**Legal/Footer Links**:
- Terms of Use
- Privacy Policy
- Security Policy
- Cookie Settings

### Home Page Components
```
components/homePage/
├── banner/ (Hero video section)
├── PromoBanner.tsx (Scrolling promotional text)
├── WhatWeOffer.tsx (Services section)
├── AttractiveJewellery.tsx (Product showcase)
├── CollectionUpdateSection.tsx (Latest collections)
├── DiscoverSection.tsx (Call-to-action section)
├── LatestBlogs.tsx (Blog preview)
├── CursorSection.tsx (Custom cursor effects)
└── index.tsx (Main home page assembly)
```

### Market Insights Components
```
components/marketInsights/
├── banner.tsx (Market insights header)
├── LivePriceWidget.tsx (Real-time prices)
├── chart-widget.tsx (Trading charts)
├── economicCalenderWidget.tsx (Economic events)
├── trading-view-market-overview.tsx (Market overview)
├── latest-news/ (News components)
└── index.tsx (Market insights assembly)
```

### Common/Shared Components
```
components/common/
├── BlogCard.tsx (Blog post cards)
├── JewelryCard.tsx (Product cards)
├── ServiceCard.tsx (Service display cards)
├── ImageSlider.tsx (Image carousel)
├── LanguageToggle.tsx (EN/AR switcher)
├── ThemeToggle.tsx (Dark/Light mode)
├── UserProfileDropdown.tsx (User menu)
├── SplashScreen.tsx (Loading screen)
├── MouseHighlighter.tsx (Custom cursor)
├── logo/ (Brand logos)
└── Icon/ (Icon components)
```

### UI Components (shadcn/ui)
```
components/ui/
├── button.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── label.tsx
├── pagination.tsx
└── tabs.tsx
```

## 🗂️ State Management

### Zustand Stores
```
stores/
├── themeStore.ts (Dark/Light theme)
├── languageStore.ts (EN/AR language)
├── sidebarStore.ts (Mobile menu state)
├── blogStore.ts (Blog data)
├── categoriesStore.ts (Content categories)
├── servicesStore.ts (Services data)
├── footerStore.ts (Footer content)
├── systemSettingsStore.ts (App settings)
└── index.ts (Store exports)
```

## 🌍 Internationalization

### Supported Languages
- **English (en)**: Default language, LTR layout
- **Arabic (ar)**: RTL layout with Arabic typography

### Locale Files
```
locales/
├── en.ts (English translations)
└── ar.ts (Arabic translations)
```

### Translation Keys Structure
- `navigation.*` - Menu and navigation items
- `common.*` - Common UI elements
- `theme.*` - Theme-related text
- `language.*` - Language switcher
- `buttons.*` - Button labels
- `forms.*` - Form labels and validation
- `pages.*` - Page-specific content

## 🎨 Styling & Theming

### Theme System
- **Light Theme**: Default bright theme
- **Dark Theme**: Dark mode with appropriate contrast
- **RTL Support**: Full right-to-left layout for Arabic
- **Responsive Design**: Mobile-first approach

### Typography
- **Primary Font**: Legquinne-Regular.otf (English)
- **Secondary Font**: Sukar Black Font.ttf (Arabic)

## 📱 Features & Functionality

### Core Features
- ✅ Multilingual support (EN/AR)
- ✅ RTL/LTR layout switching
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ SEO optimization
- ✅ Real-time market data
- ✅ Blog management
- ✅ Custom animations (GSAP)
- ✅ Video integration (YouTube)
- ✅ Custom cursor effects
- ✅ Splash screen
- ✅ Mobile-friendly navigation

### Interactive Elements
- Image sliders with fade animations
- Scrolling promotional banners
- Live price widgets
- Economic calendar
- Trading charts
- Custom mouse cursor
- Smooth scroll animations
- Mobile sidebar menu

## 🔗 External Integrations

### Third-party Services
- **TradingView**: Market charts and data
- **YouTube**: Video content embedding
- **RSS Feeds**: News aggregation
- **Socket.IO**: Real-time data updates
- **React Query**: API data management

## 📁 File Structure Summary
```
swag/
├── app/ (Next.js App Router)
├── components/ (React components)
├── stores/ (Zustand state management)
├── hooks/ (Custom React hooks)
├── lib/ (Utility functions)
├── locales/ (i18n translations)
├── types/ (TypeScript definitions)
├── public/ (Static assets)
└── providers/ (React providers)
```

This sitemap provides a comprehensive overview of the SWAG project structure, including all pages, components, APIs, and features for both English and Arabic language support.
