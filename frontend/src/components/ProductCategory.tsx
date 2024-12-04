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
    <div className="category-page bg-gray-100 py-12 px-4 md:px-16">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
      Explore Products in the <span className="text-indigo-600">{category}</span> Category
    </h1>

    <div className="product-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {categories.map((category) => (
        <Link 
          to={`/product/${category.id}`} 
          key={category.id} 
          className="category-item bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out"
        >
          <div className="product-image mb-4">
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-48 object-contain"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 truncate">{category.name}</h2>
          <p className="text-gray-600 text-sm line-clamp-4">{category.description}</p>
          <p className="text-xl font-semibold text-indigo-600 mt-2">${category.price}</p>
          
        </Link>
      ))}
    </div>

    <div className="mt-10 text-center">
      <Link 
        to="/" 
        className="text-lg font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
      >
        &larr; Back to Home
      </Link>
    </div>
  </div>
</div>

  )
}

export default ProductCategory