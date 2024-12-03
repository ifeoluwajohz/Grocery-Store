import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import Category from './Category';
import SearchPattern from './SearchPattern';
import CartItem from './CartItems'

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface FilterState {
  category: string;
  priceRange: string;
}

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [cart, setCart] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSearchPattern, setShowSearchPattern] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    priceRange: 'all',
  });

  const debounceTimeout = 300;
  let debounceTimer: NodeJS.Timeout;

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!search && Object.values(filter).every((val) => val === 'all')) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const queryParams = new URLSearchParams();
        if (search.trim()) queryParams.append('name', search.trim());
        Object.keys(filter).forEach((key) => {
          if (filter[key as keyof FilterState] !== 'all') {
            queryParams.append(key, filter[key as keyof FilterState]);
          }
        });

        const response = await fetch(`http://localhost:3600/products/search?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('product does not exist');
        }
        const data = await response.json();

        if (data.products.length === 0) {
          setError('No products found');
        } else {
          setProducts(data.products);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchData, debounceTimeout);

    return () => clearTimeout(debounceTimer);
  }, [search, filter]);

  useEffect(() => {
    setShowSearchPattern(search.trim().length > 0);
  }, [search]);

  const toggleCategory = () => setCategory((prev) => !prev);

  const handleLogout = () => {
    signOut();
    setIsLoggedIn(false);
  };

  return (
    <>
      <div className="flex items-center justify-between md:space-x-10 space-x-3 py-2 relative">
        <div className="categories relative">
          <p className="text-sm cursor-pointer" onClick={toggleCategory}>
            All Categories
          </p>
          <div className="absolute top-7 md:top-10 z-50">
            {category && <Category />}
          </div>
        </div>

        <div className="search w-0 md:w-2/3 invisible md:visible flex-grow relative flex items-center space-x-2">
          <input
            className="text-xs font-light px-4 py-1 outline-gray-900 border border-gray-700 w-full pr-10"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search for product, section, or category"
          />
          <select
            className="text-xs font-light px-2 py-1 border border-gray-700 bg-white"
            value={filter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">Category</option>
            <option value="CLOTHING">Clothing</option>
            <option value="TOYS">Toys</option>
            <option value="FOOD">Food</option>
          </select>
          <select
            className="text-xs font-light px-2 py-1 border border-gray-700 bg-white"
            value={filter.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}>
            <option value="all">Price Range</option>
            <option value="0-20">$0-$20</option>
            <option value="20-50">$20-$50</option>
            <option value="50+">$50+</option>
          </select>
          {error ? (
            <div className="text-red-500"></div>
          ) : (
            showSearchPattern && (
              <div className={`absolute top-9 right-1 flex flex-col items-start text-center z-10 bg-gray-100 flex-shrink w-0 md:w-full ${ search ? 'visible' : 'invisible' }`}  >
                <SearchPattern products={products} />
              </div>
          ))}
          </div>
        <div className="notifications flex space-x-3 items-center">
          <img
            src="https://img.icons8.com/?size=100&id=11642&format=png&color=000000"
            className="w-5"
            alt="notifications"
          />
          <img
            className="w-5 cursor-pointer"
            onClick={() => setCart(!cart)}
            src="https://img.icons8.com/ios/50/shopping-cart-loaded--v1.png"
            alt="cart"
          />
          <img
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="w-6 h-6 cursor-pointer"
            src="https://img.icons8.com/fluency/48/test-account--v1.png"
            alt="user"
          />

          {cart && (
            <div className="fixed text-center mt-3 top-8 right-2 lg:right-32 z-50 bg-slate-200 p-4 w-64 h-screen">
              <CartItem />
            </div>
          )}

          {isLoggedIn && (
            <div className="fixed mt-2 top-8 right-2 lg:right-32 z-50 bg-slate-200 p-4 w-64 mb-40">
              {user ? (
                <>
                  <Link to="/Settings" className="text-blue-600 text-xs">
                    Account Info
                  </Link>
                  <Link to="/Account_management" className="text-blue-600 text-xs">
                    Manage Account
                  </Link>
                  <p onClick={handleLogout} className="text-red-600 text-xs cursor-pointer">
                    Logout
                  </p>
                </>
              ) : (
                <Link to="/Login" className="block text-blue-600 text-xs">
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      
      {loading && <p className="text-gray-500 invisible md:visible h-0 md:h-full">Loading...</p>}
      {search && error ? <div className="text-red-500 invisible md:visible h-0 md:h-10">{error}</div> : "" }

      <div className="search w-full md:w-0 md:invisible visible flex-grow relative flex items-center space-x-2">
          <input
            className="text-xs font-light px-4 py-1 outline-gray-900 border border-gray-700 w-full pr-10"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search for product, section, or category"
          />
          <select
            className="text-xs font-light px-2 py-1 border border-gray-700 bg-white"
            value={filter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">Category</option>
            <option value="CLOTHING">Clothing</option>
            <option value="TOYS">Toys</option>
            <option value="FOOD">Food</option>
          </select>
          <select
            className="text-xs font-light px-2 py-1 border border-gray-700 bg-white"
            value={filter.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}>
            <option value="all">Price Range</option>
            <option value="0-20">$0-$20</option>
            <option value="20-50">$20-$50</option>
            <option value="50+">$50+</option>
          </select>
          {error ? (
            <div className="text-red-500"></div>
          ) : (
            showSearchPattern && (
              <div className={`absolute top-9 right-1 flex flex-col items-start text-center bg-gray-100 flex-shrink md:w-0 w-full md:invisible visible ${ search ? 'visible' : 'invisible' }`}  >
                <SearchPattern products={products} />
              </div>
          ))}
          </div>
          {loading && <p className="text-gray-500 md:invisible visible text-center py-10">Loading...</p>}
          {search && error ? <div className="text-red-500 md:invisible visible text-center py-10">{error}</div> : "" }
    </>
  );
};

export default Navbar;
