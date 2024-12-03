import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { cart, addItem, increaseItem, decreaseItem } = useCart(); // Include increaseItem, decreaseItem

  const isInCart = (itemId: string) => {
    return Array.isArray(cart) && cart.some((cartItem) => cartItem.productId === itemId);
  };

  // Function to get item quantity
  const getItemQuantity = (itemId: string) => {
  if (!Array.isArray(cart)) return 0; // Ensure cart is an array
  const cartItem = cart.find((item) => item.productId === itemId);
  return cartItem ? cartItem.quantity : 0;
};


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id || isNaN(Number(id))) {
          throw new Error('Invalid product ID');
        }

        const response = await fetch(`http://localhost:3600/products/product/${id}`);
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

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Product not found</p>;

  const itemQuantity = getItemQuantity(product.id);

  return (
    <div className="product-detail py-4">
      <Link to="/" className="text-blue-600 underline">Back to Products</Link>
      <div className="product-info mt-4 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold">Product Name: {product.name}</h2>
        <Link to={`/category/${product.category.toLowerCase()}`} className="text-gray-700 mt-8">
          CATEGORY: <span className="underline text-blue-700">{product.category}</span>
        </Link>
        <p className="text-gray-800 font-bold">
          Description: <span className="font-normal">{product.description}</span>
        </p>
        <p className="text-base font-medium"> ${product.price}</p>
        <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover mt-4" />

        {isInCart(product.id) ? (
          <div className='flex items-center space-x-4'>
            <button
              className={`px-2 py-1 text-xs font-semibold text-white rounded ${
                itemQuantity === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500'
              }`}
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
