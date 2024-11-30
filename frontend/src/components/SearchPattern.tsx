// ProductsList.tsx
import React from 'react';
import { Link } from 'react-router-dom'

interface Product {
  id: string;
  name: string;
  category:string;
}

interface ProductsListProps {
  products: Product[];
}

const SearchPattern: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <>
      {products.map((product) => (
        <div  key={product.id} className="search-card flex space-x-4 justify-between items-center px-4 w-full py-2 border ">
          <Link to={`product/${product.id}`} className="text-sm underline font-medium">{product.name}</Link>
          <Link to={`category/${product.category}`} className="text-xs underline text-gray-600">{product.category}</Link>
        </div>
      ))}
    </>
  );
};

export default SearchPattern;
