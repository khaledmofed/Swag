import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest, getAuthToken } from "@/lib/api";

// Types
interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
  };
}

interface CartResponse {
  status: boolean;
  errNum: string;
  msg: string;
  data: {
    cart: CartItem[];
  };
}

// Fetch cart
const fetchCart = async (): Promise<CartResponse> => {
  const response = await authenticatedRequest<CartResponse>(
    "GET",
    "/api/store/my-cart"
  );
  console.log("Cart API response:", response);

  // Dispatch event to update header count when cart is fetched
  if (typeof window !== "undefined") {
    const totalQuantity =
      response.data?.cart?.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      ) || 0;
    window.dispatchEvent(
      new CustomEvent("cart-updated", {
        detail: { count: totalQuantity },
      })
    );
  }

  return response;
};

// Add to cart
const addToCart = async (
  productId: number,
  quantity: number = 1
): Promise<any> => {
  return authenticatedRequest(
    "POST",
    `/api/store/add-to-cart?product_id=${productId}&quantity=${quantity}`,
    null
  );
};

// Remove from cart
const removeFromCart = async (productId: number): Promise<any> => {
  return authenticatedRequest(
    "POST",
    `/api/store/remove-from-cart?product_id=${productId}`,
    null
  );
};

// Hooks
export const useCart = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => addToCart(productId, quantity),
    onSuccess: () => {
      // Invalidate and refetch cart
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Dispatch event to update header count immediately
      if (typeof window !== "undefined") {
        setTimeout(() => {
          fetchCart()
            .then((response) => {
              const totalQuantity =
                response.data?.cart?.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                ) || 0;
              window.dispatchEvent(
                new CustomEvent("cart-updated", {
                  detail: { count: totalQuantity },
                })
              );
            })
            .catch((error) => {
              console.error("Error fetching updated cart:", error);
              window.dispatchEvent(
                new CustomEvent("cart-updated", {
                  detail: { count: null },
                })
              );
            });
        }, 300);
      }
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onSuccess: () => {
      // Invalidate and refetch cart
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Dispatch event to update header count immediately
      if (typeof window !== "undefined") {
        setTimeout(() => {
          fetchCart()
            .then((response) => {
              const totalQuantity =
                response.data?.cart?.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                ) || 0;
              window.dispatchEvent(
                new CustomEvent("cart-updated", {
                  detail: { count: totalQuantity },
                })
              );
            })
            .catch((error) => {
              console.error("Error fetching updated cart:", error);
              window.dispatchEvent(
                new CustomEvent("cart-updated", {
                  detail: { count: null },
                })
              );
            });
        }, 300);
      }
    },
  });
};
