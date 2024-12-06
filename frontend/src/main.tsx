import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from './context/CartContext.tsx';
import { WishlistProvider } from './context/WishContext';

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider >
      <CartProvider>
        <WishlistProvider>
          <App />
          </WishlistProvider>
        </CartProvider>
    </AuthProvider>
  </StrictMode>
)
