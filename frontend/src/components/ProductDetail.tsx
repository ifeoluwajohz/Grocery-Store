import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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

  return (
    <div className="product-detail py-4">
      <Link to="/" className="text-blue-600 underline">Back to Products</Link>
      <div className="product-info mt-4 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold">Product Name: {product.name}</h2>
        <Link to={`/category/${product.category.toLowerCase()}`} className="text-gray-700 mt-8">CATEGORY: <span className="underline text-blue-700">{product.category}</span></Link>
        <p className="text-gray-800 font-bold ">Description: <span className="font-normal">{product.description}</span></p>
        <p className="text-base font-medium"> ${product.price}</p>
        <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover mt-4" />
      </div>
    </div>
  );
};

export default ProductDetail;
