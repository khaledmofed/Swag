import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest, getAuthToken } from "@/lib/api";

// Types
interface FavoriteItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    image: string;
    images: string[];
  };
}

interface FavoritesResponse {
  status: boolean;
  errNum: string;
  msg: string;
  data: {
    favorite: FavoriteItem[];
  };
}

// Fetch favorites
const fetchFavorites = async (): Promise<FavoritesResponse> => {
  const response = await authenticatedRequest<FavoritesResponse>(
    "GET",
    "/api/store/my-favourite"
  );
  console.log("Favorites API response:", response);

  // Dispatch event to update header count when favorites are fetched
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("saved-products-updated", {
        detail: { count: response.data?.favorite?.length || 0 },
      })
    );
  }

  return response;
};

// Toggle favorite
const toggleFavorite = async (productId: number): Promise<any> => {
  return authenticatedRequest(
    "POST",
    `/api/store/favourite?product_id=${productId}`,
    null
  );
};

// Hooks
export const useFavorites = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => toggleFavorite(productId),
    onSuccess: () => {
      // Invalidate and refetch favorites
      queryClient.invalidateQueries({ queryKey: ["favorites"] });

      // Dispatch event to update header count immediately
      if (typeof window !== "undefined") {
        // تحديث فوري من API
        setTimeout(() => {
          fetchFavorites()
            .then((response) => {
              const count = response.data?.favorite?.length || 0;
              window.dispatchEvent(
                new CustomEvent("saved-products-updated", {
                  detail: { count },
                })
              );
            })
            .catch((error) => {
              console.error("Error fetching updated favorites:", error);
              window.dispatchEvent(
                new CustomEvent("saved-products-updated", {
                  detail: { count: null },
                })
              );
            });
        }, 300);
      }
    },
  });
};
