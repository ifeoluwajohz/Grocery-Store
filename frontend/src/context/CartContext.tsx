import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext"; // Adjust the path to your AuthContext file

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description : string;
}

interface CartContextProps {
  cart: CartItem[] | null;
  loading: boolean;
  getCart: () => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: authLoading } = useAuth();

  const getCart = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch("http://localhost:3600/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      setCart(data.cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateItem = async (id: string, quantity: number) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`http://localhost:3600/cart/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        throw new Error("Failed to update cart item");
      }
      await getCart();
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`http://localhost:3600/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete cart item");
      }
      await getCart();
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch("http://localhost:3600/cart/clear", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      getCart();
    }
  }, [authLoading, user, getCart]);

  return (
    <CartContext.Provider value={{ cart, loading, getCart, updateItem, deleteItem, clearCart }}>
      {!loading && children}
    </CartContext.Provider>
  );
};
