import axios from "axios";

const BASE_URL = "https://swag.ivadso.com";

// Create axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Utility function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("Retrieved token from localStorage:", token);
    return token;
  }
  return null;
};

// Utility function to get current language
export const getCurrentLanguage = (): string => {
  if (typeof window !== "undefined") {
    // Get language from URL path or localStorage
    const pathname = window.location.pathname;
    const locale = pathname.split("/")[1];
    if (locale === "ar") return "ar";
    if (locale === "en") return "en";

    // Fallback to localStorage or default
    const storedLang = localStorage.getItem("language") || "en";
    return storedLang;
  }
  return "en"; // Default fallback
};

// Utility function to create authenticated headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  const language = getCurrentLanguage();
  console.log("Creating headers with language:", language);

  return {
    Accept: "application/json",
    "Accept-Language": language,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Utility function for authenticated API requests
export const authenticatedRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: any,
  params?: any
): Promise<T> => {
  const token = getAuthToken();
  const language = getCurrentLanguage();
  const headers = {
    Accept: "application/json",
    "Accept-Language": language,
    Authorization: `Bearer ${token}`,
  };

  console.log(
    "Making authenticated request to:",
    endpoint,
    "with headers:",
    headers
  );

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await apiClient.request({
    method,
    url: endpoint,
    data,
    params,
    headers,
  });

  return response.data;
};

// Generic API request wrapper
export const apiRequest = async <T>(
  requestFn: () => Promise<{ data: T }>
): Promise<T> => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    throw error;
  }
};

// Helper function to create headers with language
export const createHeaders = (includeAuth = false) => {
  const language = getCurrentLanguage();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": language,
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// API endpoints
export const apiEndpoints = {
  // Auth endpoints
  sendOtp: "/api/auth/send-otp",
  verifyOtp: "/api/auth/verify-otp",
  completeRegistration: "/api/auth/complete-registration",

  // Store endpoints
  storeHome: "/api/store/home",
  storeSearch: "/api/store/search",
  storeProfile: "/api/store/profile",
  storeCart: "/api/store/my-cart",
  storeFavorites: "/api/store/my-favourite",
  addToCart: "/api/store/add-to-cart",
  removeFromCart: "/api/store/remove-from-cart",
  toggleFavorite: "/api/store/toggle-favourite",

  // Product endpoints
  productDetails: "/api/store/product",

  // Category endpoints
  categories: "/api/v1/categories",
  categoryBySlug: "/api/v1/categories",
  productsByCategory: "/api/v1/categories",

  // Blog endpoints
  blogs: "/api/v1/blogs",
  blogBySlug: "/api/v1/blogs",
  blogDetail: (slug: string) => `/api/v1/blogs/${slug}`,
  blogPopular: "/api/v1/blogs/popular",

  // Service endpoints
  services: "/api/v1/services",

  // System settings endpoints
  systemSettings: "/api/v1/system-settings",

  // Footer endpoints
  footer: "/api/v1/foot",

  // RSS Feeds endpoints
  breakingNews: "/api/breaking-news",
  currenciesNews: "/api/currencies-news",
  commoditiesNews: "/api/commodities-news",
  stockNews: "/api/stock-news",
  calendar: "/api/calendar",

  // Live market insights
  liveMarketInsights: "/api/live-market-insights",
};
