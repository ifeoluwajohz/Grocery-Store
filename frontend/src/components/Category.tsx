import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'


interface ProductCategories {
    category: string;
}

const Category: React.FC = () => {
    const [categories, setCategories] = useState<ProductCategories[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)


    useEffect(() => {
        const fetchProductsByCategory = async () => {
          setLoading(true);
          try {
            const response = await fetch(`http://localhost:3600/products/categories/`);
            if (!response.ok) {
              throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setCategories(data.categories);
            // con(data.categories);

          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProductsByCategory();
      }, []);
    
      if (loading) return <p>Loading all categories ...</p>;
      if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="category-page w-full max-w-lg p-6 bg-gray-100 rounded-lg shadow-xl h-screen overflow-y-auto">
  <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
    Categories
  </h1>

  <div className="product-list divide-y divide-gray-300">
    {categories.map((output, index) => (
      <Link 
        to={`/category/${output.category}`} 
        key={index} 
        className="block py-4 hover:bg-gray-200 rounded-md transition duration-300"
      >
        <h2 className="text-xl font-medium text-gray-800 hover:text-blue-600 pl-2">
          {output.category}
        </h2>
      </Link>
    ))}
  </div>

  <div className="mt-10">
    <Link 
      to="/" 
      className="inline-block text-lg text-blue-600 hover:text-blue-800 underline"
    >
      &larr; Back to Home
    </Link>
  </div>
</div>

  )
}

export default Category