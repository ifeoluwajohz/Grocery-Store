import React, { useEffect } from 'react';
import { useWishlist } from '../context/WishContext';

const WishlistPage = () => {
  const { error, loading, wishlist = [], getWishlistItems, addItemToWishlist, removeItemFromWishlist, clearWishlist } = useWishlist();

  useEffect(() => {
    getWishlistItems();
  }, []);

  const handleRemoveFromWishlist = (productId: string) => {
    removeItemFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  if (loading) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <div className="wishlist-container py-6 px-4 md:px-8 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Wishlist</h1>

      {wishlist && Array.isArray(wishlist) && wishlist.length > 0 ? (
        <ul className="space-y-4">
          {wishlist.map((item) => (
            item.product ? ( // Check if product exists
              <li 
                key={item.id} 
                className="flex items-center justify-between bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.product.image || '/path/to/placeholder.jpg'} // Fallback image
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {item.product.name}
                    </h3>
                    <button
                      className="text-red-500 text-sm font-medium hover:underline mt-2"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-500">
                  ₦{item.product.price.toLocaleString()}
                </p>
              </li>
            ) : null // Skip if product is undefined
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center mt-4">Your wishlist is empty.</p>
      )}

      {wishlist && wishlist.length > 0 && (
        <div className="flex justify-end mt-6">
          <button 
            onClick={handleClearWishlist} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Clear Wishlist
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
