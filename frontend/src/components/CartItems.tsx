import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartItems: React.FC = () => {
  const {
    cart,
    isLoading,
    error,
    fetchCart,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
  } = useCart();

  const [mergedCart, setMergedCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      const merged = mergeCartItems(cart);
      setMergedCart(merged.reverse()); // Recently added items first
      calculateTotalPrice(merged);
    }
  }, [cart]);

  const mergeCartItems = (cartItems) => {
    return cartItems.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);

      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.product.price += item.product.price * item.quantity; // Update price based on quantity
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
  };

  const calculateTotalPrice = (mergedItems) => {
    const total = mergedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setTotalPrice(total);
  };

  if (isLoading) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <div className="min-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-xl font-bold text-center text-gray-800">Your Cart</h1>

      {mergedCart.length > 0 && cart.length > 0 ? (
        <div
          className="mt-6 space-y-2 overflow-y-scroll"
          style={{ maxHeight: '400px' }} // Set max height for scroll
        >
          {mergedCart.map((item) => (
            <Link
              key={item.productId}
              to={`product/${item.productId}`}
              className="flex flex-col justify-center items-center bg-white py-4 rounded-lg shadow-md"
            >
              <div className="flex flex-row">
                <img className="w-full h-20 object-cover" src={item.product.image} alt="cart-img" />
              </div>
              <div className="flex flex-col space-x-2 space-y-2">
                <p className="text-sm">{item.product.name}</p>
                <p className="text-sm">N{item.product.price}</p>
                <div className="flex flex-row justify-between space-x-3">
                  <button
                    className={`px-2 py-1 text-xs font-semibold text-white rounded ${
                      item.quantity === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500'
                    }`}
                    onClick={() => item.quantity > 1 && decreaseItem(item.productId)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span className="text-gray-400">{item.quantity}</span>
                  <button
                    className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                    onClick={() => increaseItem(item.productId)}
                  >
                    +
                  </button>
                </div>
                <p
                  className="text-red-500 text-xs underline hover:font-medium ease-in-out transition-all"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-600">Your cart is empty.</p>
      )}

      <div className="mt-6 flex flex-col justify-between">
        {cart.length > 0 && (
          <button
            className="px-6 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
        {cart.length > 0 && 
        <div className="text-lg font-bold text-gray-800">
          Total: N{totalPrice.toFixed(2)}
        </div>
        }
        
      </div>
    </div>
  );
};

export default CartItems;
