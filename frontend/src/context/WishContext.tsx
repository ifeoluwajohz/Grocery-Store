import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../types/WishList'; // Define your product type here

// Define types for context state and actions
interface WishlistContextType {
    error: string | null;
    loading: boolean;
    wishlist: Product[]; // List of products in the wishlist
    getWishlistItems: () => void;
    addItemToWishlist: (productId: string) => void;
    removeItemFromWishlist: (productId: string) => void;
    clearWishlist: () => void;
}

interface WishlistProviderProps {
    children: ReactNode;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Wishlist provider component
export const WishlistProvider = ({ children }: WishlistProviderProps) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [wishlist, setWishlist] = useState<Product[]>([]);

    const token = localStorage.getItem("jwt");

    // Fetch wishlist items from the server
    const getWishlistItems = async () => {
        try {
            setLoading(true);
            setError(null); // Reset previous errors
            const response = await fetch('http://localhost:3600/wishlist/get_wishlist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch wishlist: ${response.statusText}`);
            }

            const data = await response.json();
            if (data?.wishlist) {
                setWishlist(data.wishlist);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Add item to wishlist
    const addItemToWishlist = async (productId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:3600/wishlist/post_wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId }),
            });

            const data = await response.json();
            if (data?.item) {
                setWishlist((prev) => [...prev, data.item]);
            } else {
                throw new Error('Failed to add item to wishlist');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred while adding to wishlist');
        } finally {
            setLoading(false);
        }
    };

    // Remove item from wishlist
    const removeItemFromWishlist = async (productId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:3600/wishlist/delete_wishlist?productId=${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to remove item from wishlist: ${response.statusText}`);
            }

            setWishlist((prev) => prev.filter((item) => item.id !== productId));
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred while removing from wishlist');
        } finally {
            setLoading(false);
        }
    };

    // Clear the wishlist
    const clearWishlist = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:3600/wishlist/clear_wishlist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to clear wishlist: ${response.statusText}`);
            }

            setWishlist([]);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred while clearing wishlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                error,
                loading,
                wishlist,
                getWishlistItems,
                addItemToWishlist,
                removeItemFromWishlist,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

// Custom hook to use wishlist context
export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
