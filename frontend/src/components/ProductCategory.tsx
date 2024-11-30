import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'


interface ProductCategories {
    id: number;
    name: string;
    category: string;
    price: number;
}

const ProductCategory: React.FC = () => {
    const {category } = useParams();
    const [categories, setCategories] = useState<ProductCategories[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)


    useEffect(() => {
        const fetchProductsByCategory = async () => {
          setLoading(true);
          try {
            const response = await fetch(`http://localhost:3600/products/category/${category}`);
            if (!response.ok) {
              throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setCategories(data.products);
            console.log(data.products);

          } catch (err) {
            setError(err.message);
            console.log(err.message);

          } finally {
            setLoading(false);
          }
        };
    
        fetchProductsByCategory();
      }, [category]);
    
      if (loading) return <p>Loading... {category} section</p>;
      if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="category-page text-center">
      <h1 className="text-xl font-bold">Products in {category} Category</h1>
      <div className="product-list flex py-4 justify-center text-center">
        {categories.map((category) => (
          <Link to={`/product/${category.id}`} key={category.id} className="category-item space-y-3 px-3 underline">
            <h2>{category.name}</h2>
            <p>${category.price}</p>
          </Link>
        ))}
      </div>
      <Link to="/" className="text-blue-600 underline">Back to Home</Link>
    </div>
  )
}

export default ProductCategory