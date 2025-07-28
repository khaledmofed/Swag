// Base API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// System Settings Types
export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  type: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemSettingsResponse {
  data: SystemSetting[];
}

// Footer Types
export interface FooterLink {
  id: number;
  title: string;
  url: string;
  order: number;
  is_external: boolean;
}

export interface FooterSection {
  id: number;
  title: string;
  links: FooterLink[];
  order: number;
}

export interface FooterData {
  id: number;
  company_name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  logo?: string;
  sections: FooterSection[];
  copyright_text: string;
  created_at: string;
  rich_text_section?: string;
  updated_at: string;
  social_media_links: {
    url: string;

    type: string;
  }[];
  quick_links: {
    title: string;
    links: {
      label: string;
      url: string;
    }[];
  };
  legal_links: {
    title: string;
    links: {
      label: string;
      url: string;
    }[];
  };
}

export interface FooterResponse {
  data: FooterData;
}

// Services Types
export interface Service {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  image?: string;
  icon?: string;
  slug: string;
  is_active: boolean;
  name: string;
  order: number;
  meta_title?: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface ServicesResponse {
  data: {
    items: Service[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

// Categories Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  is_active: boolean;
  order: number;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  data: {
    items: Category[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

// Blog Types
export interface BlogAuthor {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  reading_time?: number;
  views_count: number;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
  short_description?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogsResponse {
  data: {
    items: Blog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface BlogDetailResponse {
  data: Blog;
}

// API Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Request Types
export interface BlogsParams {
  per_page?: number;
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

// Store State Types
export interface ApiState {
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

export interface SystemSettingsState extends ApiState {
  settings: SystemSetting[];
  getSettingByKey: (key: string) => SystemSetting | undefined;
}

export interface FooterState extends ApiState {
  footer: FooterData | null;
}

export interface ServicesState extends ApiState {
  services: Service[];
}

export interface CategoriesState extends ApiState {
  categories: Category[];
}

export interface BlogState extends ApiState {
  blogs: Blog[];
  currentBlog: Blog | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
}

// Live Market Insights Types
export interface MarketPrice {
  id: number;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  volume_24h?: number;
  high_24h?: number;
  low_24h?: number;
  last_updated: string;
  link?: string;
  market_overview: {
    link?: string;
  };
}

export interface MarketNews {
  id: number;
  title: string;
  summary: string;
  content?: string;
  source: string;
  published_at: string;
  image_url?: string;
  category: string;
  impact_level?: "low" | "medium" | "high";
}

export interface MarketIndicator {
  id: number;
  name: string;
  value: number;
  change: number;
  change_percentage: number;
  unit: string;
  category: string;
  last_updated: string;
}

export interface LiveMarketData {
  prices: MarketPrice[];
  news: {
    caption: string;
    headline: string;
    items: MarketNews[];
  };
  indicators: MarketIndicator[];
  last_updated: string;
  economic_calendar: {
    caption: string;
    description: string;
    headline: string;
  };
}

export interface LiveMarketInsightsResponse {
  data: LiveMarketData;
  status: string;
  message?: string;
}

export interface LiveMarketInsightsState extends ApiState {
  marketData: LiveMarketData | null;
  prices: MarketPrice[];
  news: MarketNews[];
  indicators: MarketIndicator[];
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface BlogPopular {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  reading_time?: number;
  views_count: number;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
  short_description?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}
