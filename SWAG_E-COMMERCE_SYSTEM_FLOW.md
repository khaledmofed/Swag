# SWAG E-Commerce System Flow & APIs Documentation

## 📊 System Overview Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SWAG E-COMMERCE SYSTEM                            │
│                    متجر المجوهرات والمعادن الثمينة                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   BACKEND API   │    │   EXTERNAL      │
│   (Next.js)     │◄──►│   (Laravel)     │◄──►│   SERVICES      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 Authentication Flow (تسجيل الدخول)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                               │
│                              سير عملية تسجيل الدخول                          │
└─────────────────────────────────────────────────────────────────────────────┘

1. LOGIN PROCESS (تسجيل الدخول)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │───►│  Frontend   │───►│   Backend   │───►│   SMS       │
   │  Enters     │    │   Login     │    │   API       │    │  Service    │
   │  Phone      │    │   Form      │    │   /auth/    │    │  (Twilio)   │
   │  Number     │    │             │    │   send-otp  │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │◄───│  Frontend   │◄───│   Backend   │◄───│   SMS       │
   │  Receives   │    │   Shows     │    │   Returns   │    │   Sends     │
   │   OTP       │    │   OTP       │    │   Success   │    │   OTP       │
   │   SMS       │    │   Input     │    │   Response  │    │   Code      │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

2. OTP VERIFICATION (التحقق من الكود)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │───►│  Frontend   │───►│   Backend   │───►│   Database  │
   │  Enters     │    │   OTP       │    │   API       │    │   Verify    │
   │   OTP       │    │   Form      │    │   /auth/    │    │   OTP &     │
   │   Code      │    │             │    │   verify    │    │   Create    │
   └─────────────┘    └─────────────┘    └─────────────┘    │   Session   │
                              │                    │        └─────────────┘
                              ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │◄───│  Frontend   │◄───│   Backend   │
   │  Logged     │    │   Stores    │    │   Returns   │
   │   In        │    │   JWT       │    │   JWT       │
   │   Success   │    │   Token     │    │   Token     │
   └─────────────┘    └─────────────┘    └─────────────┘

3. REGISTRATION PROCESS (تسجيل حساب جديد)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │───►│  Frontend   │───►│   Backend   │───►│   Database  │
   │  Fills      │    │   Register  │    │   API       │    │   Create    │
   │  Form       │    │   Form      │    │   /auth/    │    │   User      │
   │  Data       │    │             │    │   register  │    │   Account   │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │◄───│  Frontend   │◄───│   Backend   │◄───│   Database  │
   │  Account    │    │   Shows     │    │   Returns   │    │   Account   │
   │  Created    │    │   Success   │    │   Success   │    │   Created   │
   │   Success   │    │   Message   │    │   Response  │    │   Success   │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 🛍️ E-Commerce Core Operations (العمليات الأساسية للمتجر)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        E-COMMERCE CORE OPERATIONS                           │
│                           العمليات الأساسية للمتجر                           │
└─────────────────────────────────────────────────────────────────────────────┘

1. PRODUCT BROWSING (تصفح المنتجات)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │───►│  Frontend   │───►│   Backend   │───►│   Database  │
   │  Browses    │    │   Category  │    │   API       │    │   Products  │
   │  Categories │    │   Page      │    │   /products │    │   Table     │
   │             │    │             │    │   /categories│   │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │◄───│  Frontend   │◄───│   Backend   │◄───│   Database  │
   │  Views      │    │   Displays  │    │   Returns   │    │   Returns   │
   │  Products   │    │   Products  │    │   Products  │    │   Data      │
   │  List       │    │   Grid      │    │   Data      │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

2. PRODUCT SEARCH & FILTERING (البحث والفلترة)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │───►│  Frontend   │───►│   Backend   │───►│   Database  │
   │  Searches   │    │   Search    │    │   API       │    │   Products  │
   │  & Filters  │    │   Form      │    │   /products │    │   Table     │
   │             │    │             │    │   /search   │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │◄───│  Frontend   │◄───│   Backend   │◄───│   Database  │
   │  Views      │    │   Shows     │    │   Returns   │    │   Returns   │
   │  Filtered   │    │   Filtered  │    │   Filtered  │    │   Filtered  │
   │  Results    │    │   Results   │    │   Results   │    │   Data      │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

3. PRODUCT DETAILS (تفاصيل المنتج)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │───►│  Frontend   │───►│   Backend   │───►│   Database  │
   │  Clicks     │    │   Product   │    │   API       │    │   Products  │
   │  Product    │    │   Detail    │    │   /products │    │   Table     │
   │             │    │   Page      │    │   /{slug}   │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │◄───│  Frontend   │◄───│   Backend   │◄───│   Database  │
   │  Views      │    │   Shows     │    │   Returns   │    │   Returns   │
   │  Product    │    │   Product   │    │   Product   │    │   Product   │
   │  Details    │    │   Details   │    │   Data      │    │   Data      │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

4. CART OPERATIONS (عمليات السلة)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │───►│  Frontend   │───►│   Backend   │───►│   Database  │
   │  Adds to    │    │   Cart      │    │   API       │    │   Cart      │
   │  Cart       │    │   Store     │    │   /cart/    │    │   Table     │
   │             │    │   (Local)   │    │   add       │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │◄───│  Frontend   │◄───│   Backend   │◄───│   Database  │
   │  Cart       │    │   Updates   │    │   Returns   │    │   Cart      │
   │  Updated    │    │   Cart      │    │   Success   │    │   Updated   │
   │             │    │   Count     │    │   Response  │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

5. FAVORITES/WISHLIST (المفضلة)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │───►│  Frontend   │───►│   Backend   │───►│   Database  │
   │  Adds to    │    │   Favorites │    │   API       │    │   Favorites │
   │  Favorites  │    │   Store     │    │   /favorites│    │   Table     │
   │             │    │   (Local)   │    │   /add      │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │◄───│  Frontend   │◄───│   Backend   │◄───│   Database  │
   │  Product    │    │   Updates   │    │   Returns   │    │   Favorites │
   │  Added to   │    │   Heart     │    │   Success   │    │   Updated   │
   │  Favorites  │    │   Icon      │    │   Response  │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

6. CHECKOUT PROCESS (عملية الشراء)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │───►│  Frontend   │───►│   Backend   │───►│   Database  │
   │  Proceeds   │    │   Checkout  │    │   API       │    │   Orders    │
   │  to Checkout│    │   Form      │    │   /orders/  │    │   Table     │
   │             │    │             │    │   create    │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   User      │◄───│  Frontend   │◄───│   Backend   │◄───│   Database  │
   │  Order      │    │   Shows     │    │   Returns   │    │   Order     │
   │  Confirmed  │    │   Order     │    │   Order     │    │   Created   │
   │             │    │   Success   │    │   Details   │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 📡 Required APIs (الـ APIs المطلوبة)

### 🔐 Authentication APIs

```
POST /api/v1/auth/send-otp
├── Input: { phone: string }
├── Output: { success: boolean, message: string }
└── Description: إرسال كود OTP إلى رقم الجوال

POST /api/v1/auth/verify-otp
├── Input: { phone: string, otp: string }
├── Output: { success: boolean, token: string, user: User }
└── Description: التحقق من كود OTP وإنشاء جلسة

POST /api/v1/auth/register
├── Input: {
│   firstName: string,
│   lastName: string,
│   email: string,
│   phone: string,
│   gender?: string,
│   relationship?: string,
│   birthdayMonth?: string,
│   birthdayDay?: string,
│   accountType?: string,
│   registrationNumber?: string,
│   companyName?: string
│ }
├── Output: { success: boolean, user: User }
└── Description: تسجيل حساب جديد

POST /api/v1/auth/logout
├── Input: { token: string }
├── Output: { success: boolean }
└── Description: تسجيل الخروج
```

### 🛍️ Product APIs

```
GET /api/v1/categories
├── Input: { active_only?: boolean }
├── Output: { items: Category[], pagination: Pagination }
└── Description: جلب جميع الفئات

GET /api/v1/categories/{slug}
├── Input: { slug: string }
├── Output: { category: Category, products: Product[] }
└── Description: جلب فئة محددة مع منتجاتها

GET /api/v1/products
├── Input: {
│   page?: number,
│   per_page?: number,
│   category?: string,
│   search?: string,
│   min_price?: number,
│   max_price?: number,
│   karat?: string,
│   sort_by?: string
│ }
├── Output: { items: Product[], pagination: Pagination }
└── Description: جلب المنتجات مع الفلترة والترتيب

GET /api/v1/products/{slug}
├── Input: { slug: string }
├── Output: { product: Product, related_products: Product[] }
└── Description: جلب تفاصيل منتج محدد

GET /api/v1/products/search
├── Input: { query: string, filters?: object }
├── Output: { items: Product[], pagination: Pagination }
└── Description: البحث في المنتجات
```

### 🛒 Cart APIs

```
GET /api/v1/cart
├── Input: { token: string }
├── Output: { items: CartItem[], total: number }
└── Description: جلب محتويات السلة

POST /api/v1/cart/add
├── Input: { token: string, product_id: number, quantity: number }
├── Output: { success: boolean, cart: Cart }
└── Description: إضافة منتج إلى السلة

PUT /api/v1/cart/update
├── Input: { token: string, item_id: number, quantity: number }
├── Output: { success: boolean, cart: Cart }
└── Description: تحديث كمية منتج في السلة

DELETE /api/v1/cart/remove
├── Input: { token: string, item_id: number }
├── Output: { success: boolean, cart: Cart }
└── Description: إزالة منتج من السلة

POST /api/v1/cart/clear
├── Input: { token: string }
├── Output: { success: boolean }
└── Description: تفريغ السلة
```

### ❤️ Favorites APIs

```
GET /api/v1/favorites
├── Input: { token: string }
├── Output: { items: Product[] }
└── Description: جلب المنتجات المفضلة

POST /api/v1/favorites/add
├── Input: { token: string, product_id: number }
├── Output: { success: boolean }
└── Description: إضافة منتج إلى المفضلة

DELETE /api/v1/favorites/remove
├── Input: { token: string, product_id: number }
├── Output: { success: boolean }
└── Description: إزالة منتج من المفضلة
```

### 💳 Order APIs

```
POST /api/v1/orders/create
├── Input: {
│   token: string,
│   items: CartItem[],
│   shipping_address: Address,
│   payment_method: string,
│   total_amount: number
│ }
├── Output: { success: boolean, order: Order }
└── Description: إنشاء طلب جديد

GET /api/v1/orders
├── Input: { token: string, page?: number }
├── Output: { items: Order[], pagination: Pagination }
└── Description: جلب طلبات المستخدم

GET /api/v1/orders/{id}
├── Input: { token: string, order_id: number }
├── Output: { order: Order }
└── Description: جلب تفاصيل طلب محدد
```

### 📊 Market Insights APIs

```
GET /api/v1/market-insights/prices
├── Input: { symbols?: string[] }
├── Output: { prices: PriceData[] }
└── Description: جلب أسعار المعادن الثمينة

GET /api/v1/market-insights/news
├── Input: { category?: string, limit?: number }
├── Output: { news: NewsItem[] }
└── Description: جلب أخبار السوق

GET /api/v1/market-insights/calendar
├── Input: { date?: string }
├── Output: { events: CalendarEvent[] }
└── Description: جلب الأحداث الاقتصادية
```

### 🔍 SEO APIs

```
GET /api/v1/seo/sitemap
├── Input: { format?: 'xml' | 'json' }
├── Output: { urls: SitemapUrl[], lastmod: string }
└── Description: إنشاء خريطة الموقع ديناميكياً

GET /api/v1/seo/robots
├── Input: {}
├── Output: { content: string }
└── Description: إنشاء ملف robots.txt ديناميكياً

POST /api/v1/seo/structured-data
├── Input: { type: string, data: object }
├── Output: { success: boolean, schema: string }
└── Description: إنشاء بيانات منظمة JSON-LD

GET /api/v1/seo/meta-tags
├── Input: { page: string, locale?: string }
├── Output: { title: string, description: string, keywords: string[] }
└── Description: جلب العلامات الوصفية للصفحة

POST /api/v1/seo/analytics
├── Input: { event: string, data: object }
├── Output: { success: boolean }
└── Description: تتبع أحداث SEO وتحليلات الموقع
```

## 🗄️ Database Schema (هيكل قاعدة البيانات)

### Users Table

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    gender ENUM('male', 'female') NULL,
    relationship ENUM('single', 'married') NULL,
    birthday_month VARCHAR(20) NULL,
    birthday_day VARCHAR(2) NULL,
    account_type ENUM('person', 'establishment') NULL,
    registration_number VARCHAR(50) NULL,
    company_name VARCHAR(255) NULL,
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Categories Table

```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    image VARCHAR(255) NULL,
    parent_id BIGINT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

### Products Table

```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NULL,
    category_id BIGINT NOT NULL,
    karat ENUM('18K', '21K', '22K', '24K') NULL,
    weight DECIMAL(8,3) NULL,
    images JSON NULL,
    is_new BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Cart Table

```sql
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_user_product (user_id, product_id)
);
```

### Favorites Table

```sql
CREATE TABLE favorites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_user_product (user_id, product_id)
);
```

### Orders Table

```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSON NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table

```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### SEO Tables

```sql
CREATE TABLE seo_meta_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    page_slug VARCHAR(255) UNIQUE NOT NULL,
    locale VARCHAR(5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    keywords TEXT NULL,
    og_title VARCHAR(255) NULL,
    og_description TEXT NULL,
    og_image VARCHAR(255) NULL,
    canonical_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE seo_structured_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    page_slug VARCHAR(255) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    schema_data JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE seo_analytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(50) NOT NULL,
    page_url VARCHAR(255) NOT NULL,
    user_agent TEXT NULL,
    ip_address VARCHAR(45) NULL,
    referrer VARCHAR(255) NULL,
    event_data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 State Management Flow (تدفق إدارة الحالة)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STATE MANAGEMENT FLOW                             │
│                              تدفق إدارة الحالة                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───►│  Component  │───►│   Store     │───►│   API       │
│  Action     │    │   (React)   │    │  (Zustand)  │    │  (Axios)    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                    │                    │                    │
       ▼                    ▼                    ▼                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   UI        │◄───│  Component  │◄───│   Store     │◄───│   Backend   │
│  Updates    │    │   Re-render │    │   State     │    │   Response  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

STORES USED:
├── useLanguageStore (إدارة اللغة والاتجاه)
├── useThemeStore (إدارة الثيم)
├── useUserStore (بيانات المستخدم)
├── useCategoriesStore (الفئات)
├── useProductsStore (المنتجات)
├── useCartStore (السلة)
├── useFavoritesStore (المفضلة)
├── useOrdersStore (الطلبات)
├── useSEOStore (إدارة SEO)
└── useSystemSettingsStore (إعدادات النظام)
```

## 📱 Frontend Components Structure (هيكل مكونات الواجهة)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND COMPONENTS STRUCTURE                        │
│                            هيكل مكونات الواجهة الأمامية                     │
└─────────────────────────────────────────────────────────────────────────────┘

PAGES:
├── /[locale]/ (الصفحة الرئيسية)
├── /[locale]/login (تسجيل الدخول)
├── /[locale]/register (تسجيل حساب جديد)
├── /[locale]/store (المتجر)
├── /[locale]/category/[slug] (فئة المنتجات)
├── /[locale]/products/[slug] (تفاصيل المنتج)
├── /[locale]/search (البحث)
├── /[locale]/cart (السلة)
├── /[locale]/favorites (المفضلة)
├── /[locale]/orders (الطلبات)
├── /[locale]/profile (الملف الشخصي)
├── /[locale]/about (من نحن)
├── /[locale]/terms (شروط الاستخدام)
├── /[locale]/privacy (سياسة الخصوصية)
└── /[locale]/market-insights (رؤى السوق)

COMPONENTS:
├── Layout/
│   ├── Header (الهيدر)
│   ├── Footer (الفوتر)
│   ├── Sidebar (الشريط الجانبي)
│   └── MainLayout (التخطيط الرئيسي)
├── Common/
│   ├── ProductCard (بطاقة المنتج)
│   ├── CategoryCard (بطاقة الفئة)
│   ├── Button (الزر)
│   ├── Input (حقل الإدخال)
│   └── Modal (النافذة المنبثقة)
├── HomePage/
│   ├── HeroBanner (البانر الرئيسي)
│   ├── FeaturedProducts (المنتجات المميزة)
│   └── LatestBlogs (أحدث المدونات)
├── Store/
│   ├── ProductGrid (شبكة المنتجات)
│   ├── ProductFilter (فلتر المنتجات)
│   └── ProductSort (ترتيب المنتجات)
└── MarketInsights/
    ├── LivePrices (الأسعار المباشرة)
    ├── MarketNews (أخبار السوق)
    └── EconomicCalendar (التقويم الاقتصادي)
```

## 🔍 SEO Strategy (استراتيجية تحسين محركات البحث)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SEO STRATEGY OVERVIEW                             │
│                    استراتيجية شاملة لتحسين محركات البحث                      │
└─────────────────────────────────────────────────────────────────────────────┘

1. TECHNICAL SEO (التحسين التقني)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Core      │───►│   Mobile    │───►│   Page      │───►│   SSL       │
   │   Web       │    │   First     │    │   Speed     │    │   & HTTPS   │
   │   Vitals    │    │   Design    │    │   Opt.      │    │   Security  │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   XML       │◄───│   Robots    │◄───│   Structured│◄───│   Canonical │
   │   Sitemap   │    │   .txt      │    │   Data      │    │   URLs      │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

2. CONTENT SEO (تحسين المحتوى)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Keyword   │───►│   Meta      │───►│   Header    │───►│   Content   │
   │   Research  │    │   Tags      │    │   Tags      │    │   Opt.      │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Internal  │◄───│   Alt       │◄───│   URL       │◄───│   Content   │
   │   Linking   │    │   Text      │    │   Structure │    │   Local.    │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

3. E-COMMERCE SEO (SEO للتجارة الإلكترونية)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Product   │───►│   Category  │───►│   Product   │───►│   Price     │
   │   Schema    │    │   Pages     │    │   Reviews   │    │   Schema    │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Bread-    │◄───│   Filter    │◄───│   Product   │◄───│   Stock     │
   │   crumbs    │    │   URLs      │    │   Images    │    │   Status    │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

4. LOCAL SEO (SEO المحلي)
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Google    │───►│   Local     │───►│   Local     │───►│   Reviews   │
   │   My        │    │   Keywords  │    │   Schema    │    │   Management│
   │   Business  │    │             │    │             │    │             │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   Local     │◄───│   Local     │◄───│   Customer  │◄───│   Local     │
   │   Citations │    │   Content   │    │   Reviews   │    │   Content   │
   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 🎯 Target Keywords Strategy (استراتيجية الكلمات المفتاحية)

#### Primary Keywords (Arabic)

- مجوهرات ذهب
- خواتم ذهب
- أساور ذهب
- سلاسل ذهب
- أقراط ذهب
- سبائك ذهب
- عملات ذهب
- مجوهرات فضة
- مجوهرات ألماس
- متجر مجوهرات

#### Primary Keywords (English)

- gold jewelry
- gold rings
- gold bracelets
- gold necklaces
- gold earrings
- gold bullion
- gold coins
- silver jewelry
- diamond jewelry
- jewelry store

#### Long-tail Keywords

- خواتم خطوبة ذهب عيار 21
- أساور ذهب نسائية عيار 18
- سلاسل ذهب رجالية عيار 24
- أقراط ألماس طبيعي
- سبائك ذهب للاستثمار
- عملات ذهب قديمة

### 📊 SEO Implementation Plan (خطة تنفيذ SEO)

#### Phase 1: Technical Foundation

- [ ] SSL Certificate Installation
- [ ] XML Sitemap Generation
- [ ] Robots.txt Configuration
- [ ] Core Web Vitals Optimization
- [ ] Mobile Responsiveness

#### Phase 2: Content Optimization

- [ ] Meta Tags Implementation
- [ ] Structured Data Markup
- [ ] Content Localization
- [ ] Internal Linking Strategy
- [ ] Image Optimization

#### Phase 3: E-Commerce Specific

- [ ] Product Schema Implementation
- [ ] Category Page Optimization
- [ ] Review System Integration
- [ ] Price & Availability Schema
- [ ] Breadcrumb Navigation

#### Phase 4: Local SEO

- [ ] Google My Business Setup
- [ ] Local Schema Markup
- [ ] Local Citations Building
- [ ] Customer Reviews Strategy
- [ ] Local Content Creation

### 📈 SEO Monitoring & Analytics (مراقبة وتحليلات SEO)

#### Search Console

- Keyword Performance Tracking
- Click-through Rate Analysis
- Indexing Status Monitoring
- Mobile Usability Reports
- Core Web Vitals Monitoring

#### Analytics Tools

- Google Analytics 4 Setup
- E-commerce Tracking
- Conversion Funnel Analysis
- User Behavior Tracking
- Traffic Source Analysis

#### Rank Tracking

- Keyword Position Monitoring
- Competitor Analysis
- Local Search Rankings
- Featured Snippets Tracking
- Voice Search Optimization

## 🚀 Development Tasks Priority (أولوية مهام التطوير)

### Phase 1: Core Authentication (المرحلة الأولى: المصادقة الأساسية)

1. ✅ Login/Register UI Components
2. 🔄 Backend Authentication APIs
3. 🔄 OTP SMS Integration
4. 🔄 JWT Token Management
5. 🔄 User Profile Management

### Phase 2: Product Management (المرحلة الثانية: إدارة المنتجات)

1. ✅ Categories API & Frontend
2. 🔄 Products API & Frontend
3. 🔄 Product Search & Filtering
4. 🔄 Product Details Page
5. 🔄 Image Management

### Phase 3: Shopping Features (المرحلة الثالثة: ميزات التسوق)

1. 🔄 Cart Management (Frontend + Backend)
2. 🔄 Favorites/Wishlist
3. 🔄 Product Reviews & Ratings
4. 🔄 Stock Management
5. 🔄 Price Management

### Phase 4: Checkout & Orders (المرحلة الرابعة: الشراء والطلبات)

1. 🔄 Checkout Process
2. 🔄 Payment Integration
3. 🔄 Order Management
4. 🔄 Order Tracking
5. 🔄 Email Notifications

### Phase 5: Advanced Features (المرحلة الخامسة: الميزات المتقدمة)

1. 🔄 Market Insights Integration
2. 🔄 Live Price Updates
3. 🔄 Advanced Search
4. 🔄 Recommendations
5. 🔄 Analytics & Reporting

### Phase 6: SEO & Marketing (المرحلة السادسة: SEO والتسويق)

1. 🔄 Technical SEO Implementation
2. 🔄 Content SEO Optimization
3. 🔄 E-commerce SEO Features
4. 🔄 Local SEO Setup
5. 🔄 SEO Analytics & Monitoring

## 🔧 Technical Stack (المكدس التقني)

### Frontend

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + RTL Support
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Internationalization**: i18next
- **UI Components**: Radix UI + Custom Components

### Backend

- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **Database**: MySQL 8.0
- **Authentication**: JWT + SMS OTP
- **File Storage**: AWS S3 / Local Storage
- **Queue System**: Redis + Laravel Queue
- **Caching**: Redis

### External Services

- **SMS Service**: Twilio / AWS SNS
- **Payment Gateway**: Stripe / PayPal
- **Market Data**: TradingView API
- **Email Service**: SendGrid / AWS SES
- **CDN**: Cloudflare / AWS CloudFront

### SEO & Analytics

- **SEO Tools**: Google Search Console
- **Analytics**: Google Analytics 4
- **Rank Tracking**: SEMrush / Ahrefs
- **Schema Markup**: JSON-LD Generator
- **Performance**: Google PageSpeed Insights
- **Local SEO**: Google My Business

## 📊 Performance Considerations (اعتبارات الأداء)

### Frontend Optimization

- ✅ Lazy Loading Components
- ✅ Image Optimization
- ✅ Code Splitting
- ✅ Caching Strategies
- 🔄 Service Worker (PWA)

### Backend Optimization

- 🔄 Database Indexing
- 🔄 Query Optimization
- 🔄 API Caching
- 🔄 Rate Limiting
- 🔄 Load Balancing

### Monitoring & Analytics

- 🔄 Error Tracking (Sentry)
- 🔄 Performance Monitoring
- 🔄 User Analytics
- 🔄 Business Metrics
- 🔄 SEO Analytics

---

## 📋 Implementation Checklist (قائمة التحقق من التنفيذ)

### Authentication System

- [ ] Backend Authentication APIs
- [ ] SMS OTP Integration
- [ ] JWT Token Management
- [ ] User Profile APIs
- [ ] Password Reset Flow

### Product Management

- [ ] Categories CRUD APIs
- [ ] Products CRUD APIs
- [ ] Image Upload & Management
- [ ] Product Search & Filtering
- [ ] Product Reviews System

### Shopping Cart

- [ ] Cart Management APIs
- [ ] Cart Persistence
- [ ] Cart Synchronization
- [ ] Cart Validation
- [ ] Cart Abandonment Recovery

### Checkout Process

- [ ] Checkout Flow APIs
- [ ] Payment Gateway Integration
- [ ] Order Management
- [ ] Order Confirmation
- [ ] Order Tracking

### User Experience

- [ ] Responsive Design
- [ ] RTL/LTR Support
- [ ] Dark/Light Theme
- [ ] Loading States
- [ ] Error Handling

### SEO & Marketing

- [ ] Technical SEO Implementation
- [ ] Content SEO Optimization
- [ ] E-commerce SEO Features
- [ ] Local SEO Setup
- [ ] Analytics & Monitoring

### Performance & Security

- [ ] API Rate Limiting
- [ ] Input Validation
- [ ] SQL Injection Prevention
- [ ] XSS Protection
- [ ] CSRF Protection

---

_This document serves as a comprehensive guide for the SWAG E-Commerce system development team. It outlines all major operations, APIs, and implementation priorities for building a robust jewelry and bullion trading platform._
