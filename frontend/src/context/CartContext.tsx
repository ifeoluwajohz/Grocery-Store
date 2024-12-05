import React, { createContext, useState, useContext, ReactNode } from 'react';


interface Product {
  id: string;
  name: string;
  price: string | string ; // Consider using `number` for price
  category: string;
  image: string;
}

interface CartItem {
  id: string; // Unique cart item identifier
  productId: string; // Related to Product
  quantity: number;
  product: Product; // Include full product details
}

interface addProduct {
  quantity : number;
  productId : string;
}

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (item: addProduct) => Promise<void>;
  increaseItem: (id: string) => Promise<void>;
  decreaseItem: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isAuthenticated: boolean;
  setAuthStatus: (status: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("jwt");

  
  const fetchCart = async () => {
    const token = localStorage.getItem("jwt");
    setIsLoading(true);
    setError(null)
    try {
      const response = await fetch("http://localhost:3600/carts/get_cartItems", {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();


      setCart(data.cart); // Expect product details nested under `product`
    } catch (err) {
      setError((err as Error).message);

    } finally {
      setIsLoading(false);
    }
  };
  

  const addItem = async (item: addProduct) => {

    const token = localStorage.getItem("jwt");
    try {
      const response = await fetch("http://localhost:3600/carts/cart_post", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(item),
        
      });
      console.log(response)
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.log(error)
      setError((error as Error).message);
    }
  };

  const increaseItem = async (id: string) => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await fetch(`http://localhost:3600/carts/cart/productId=${id}/increase`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        
      });
      console.log(response)
      await fetchCart(); // Refresh cart
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const decreaseItem = async (id: string) => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await fetch(`http://localhost:3600/carts/cart/productId=${id}/decrease`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        
      });
      console.log(response)
      await fetchCart(); // Refresh cart
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3600/carts/cart_delete/productId=${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      });
      console.log(response)
      // if (!response.ok) throw new Error('Failed to remove item');
      await fetchCart();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:3600/carts/delete_all', {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      });
      
      if (!response.ok) throw new Error('Failed to clear cart');
      await fetchCart();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        fetchCart,
        addItem,
        increaseItem,
        decreaseItem,
        removeItem,
        clearCart,
        isAuthenticated,
        setAuthStatus: setIsAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
