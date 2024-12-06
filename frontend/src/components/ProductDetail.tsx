import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishContext';

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { wishlist, addItemToWishlist, removeItemFromWishlist } = useWishlist();
  const { cart, fetchCart, addItem, increaseItem, decreaseItem } = useCart();

  // Handle adding/removing from wishlist
  const handleToggleWishlist = (productId: string) => {
    if (wishlist.some((item) => item.id === productId)) {
      removeItemFromWishlist(productId);
    } else {
      addItemToWishlist(productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const isInCart = (itemId: string) => {
    return Array.isArray(cart) && cart.some((cartItem) => cartItem.productId === itemId);
  };

  const getItemQuantity = (itemId: string) => {
    if (!Array.isArray(cart)) return 0;
    const cartItem = cart.find((item) => item.productId === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id || isNaN(Number(id))) {
          throw new Error('Invalid product ID');
        }

        const response = await fetch(`https://zorra-lxsj.onrender.com/products/product/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }

        const data: ProductDetail = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Product not found</p>;

  const itemQuantity = getItemQuantity(product.id);

  // Heart SVG icon component
  const HeartIcon = ({ filled }: { filled: boolean }) => {
    return filled ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-red-500">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-gray-400">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    );
  };

  return (
    <div className="product-detail py-6 px-4 md:px-8 bg-gray-50 rounded-lg shadow-lg">
      <Link to="/" className="text-blue-600 underline hover:text-blue-800">
        &larr; Back to Products
      </Link>
      
      <div className="product-info mt-6 space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Product Name: <span className="text-green-600">{product.name}</span>
        </h2>
        
        <Link 
          to={`/category/${product.category.toLowerCase()}`} 
          className="text-gray-700 hover:text-blue-700"
        >
          CATEGORY: <span className="underline font-medium">{product.category}</span>
        </Link>
        
        <p className="text-gray-800 font-semibold">
          Description: <span className="font-normal text-gray-700">{product.description}</span>
        </p>
        
        <p className="text-2xl font-bold text-green-500">
          ₦{product.price.toLocaleString()}
        </p>
        
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-64 object-contain rounded-md"
        />
        
        <div className="wishlist-icon mt-4">
          <button
            onClick={() => handleToggleWishlist(product.id)}
            className="text-2xl"
          >
            <HeartIcon filled={isInWishlist(product.id)} />
          </button>
        </div>

        {isInCart(product.id) ? (
          <div className="flex items-center space-x-4 mt-4">
            <button
              className={`px-3 py-1 text-sm font-semibold text-white rounded ${itemQuantity === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
              onClick={() => itemQuantity > 1 && decreaseItem(product.id)}
              disabled={itemQuantity === 1}
            >
              -
            </button>
            <span className="text-lg font-bold">{itemQuantity}</span>
            <button
              onClick={() => increaseItem(product.id)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem({ productId: product.id, quantity: 1 })}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 w-full md:w-auto"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
