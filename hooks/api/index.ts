// Export all API hooks
export * from "./useBlogs";
export * from "./useCategories";
// Export specific functions from useCategoryProducts to avoid naming conflicts
export {
  useCategoryBySlug,
  useProductsByCategory,
  fetchCategoryBySlug,
  fetchProductsByCategory,
  type CategoryProduct,
  type CategoryProductsResponse,
  type Category as CategoryForProducts,
} from "./useCategoryProducts";
export * from "./useServices";
export * from "./useSystemSettings";
export * from "./useFooter";
export * from "./useProductDetails";
export * from "./useCart";
export * from "./useFavorites";
export * from "./useRSSFeeds";
export * from "./useLiveMarketInsights";
export * from "./useLivePricesSocket";
export * from "./useStoreHome";
