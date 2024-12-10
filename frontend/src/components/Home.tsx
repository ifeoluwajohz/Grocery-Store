import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import features from '../data/data.json'

// import { CartProvider } from '../context/CartContext';

interface addToCart {
  add: string;
}
interface addToWishList {
  add : string;
}

interface Features {
  img: string;
  title: string;
  info: string;
}

interface Produce {
  id: number;
  name : string;
  price: string;
  image: string;
  addtoCart : addToCart[];
  addtoWishList : addToWishList[];
}

const Home = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('')
  const [products, setProducts] = useState<Produce[]>([])
  const featuring: Features[] = features.features;


  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true)
      try{
        const response = await fetch(`https://zorra-lxsj.onrender.com/products/category/CLOTHING`);
        const data = await response.json()
        setProducts(data.products)
      }catch(error){
        if (error instanceof Error){
        setError(error.message)

        }
      }finally{
        setLoading(false)
      }
    } 
    fetchCategory()
  }, [])
  return (
    <>
      <div className='mt-16'>
      <div className="first-carousel relative">
  <img 
    className="h-96 w-full object-cover" 
    src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/d01d0447-5de2-4668-be81-f9163e69b958/M+J+ESS+STMT+WSH+TOP.png" 
    alt="Fashion Collection" 
  />

  <div className="absolute top-1/2 transform -translate-y-1/2 left-4 md:left-8 lg:w-1/3 w-full text-center md:text-left px-4 space-y-4">
    <p className="text-lg md:text-xl font-medium uppercase">Exclusive Fashion Collection</p>
    <p className="text-2xl md:text-4xl font-bold leading-tight">
      Trendy & Timeless Designs <br />
      <span className="font-light">For Every Occasion</span>
    </p>
    <p className="text-xs md:text-sm">
      Discover the perfect outfit that combines style and comfort. Shop our latest arrivals now!
    </p>
    <div>
      <button className="bg-green-500 hover:bg-green-600 transition px-6 py-2 text-white rounded-md text-xs md:text-sm">
        SHOP THE COLLECTION
      </button>
    </div>
  </div>
      </div>

      <div className="top-saver my-10">
        <h1 className="text-2xl"><span className='underline'>Top</span> Saver Today</h1>
        {loading && <p>Loading ...</p>}
        {error &&  <p className="text-red-300">{error}</p>}
        <div className="product-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <Link 
            to={`product/${product.id}`} 
            key={product.id} 
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out"
          >
            <img 
              src={product.image} 
              alt="Fresh veggies" 
              className="w-full h-48 object-contain"
            />
            <div className="flex flex-col items-start">
              <button className="bg-green-500 text-xs px-3 py-1 text-white rounded">50% off</button>
              <p className="text-sm mt-2 line-clamp-1">{product.name}</p>
              <p className="text-lg text-black font-semibold mt-2">
              $ <span className="text-lg text-green-400 font-bold">{product.price}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      </div> 
      <div className="flyer my-10 relative group lg:text-black text-white">
  <img 
    className="h-64 w-full object-cover -z-10" 
    src="https://images.ctfassets.net/8cd2csgvqd3m/5PiiAkqbY9qH1Yb3XOHk9K/80b555d2452c1759c868fb4c504209a8/Packshot-Beoplay-Eleven-Copper-Tone-Case-Earphones-Perspective-s1200x1200px.png?q=85&fm=webp&w=720&h=720&fit=fill" 
    alt="Electronics Flyer Background" 
  />
  <div className="absolute inset-0 flex items-center justify-center z-10 text-center bg-black bg-opacity-50 px-6">
    <div>
      <p className="text-base md:text-lg font-medium uppercase tracking-wide">
        The Future of Technology
      </p>
      <p className="text-2xl md:text-4xl font-bold my-2">
        Latest Electronics <span className="font-light">Collection</span>
      </p>
      <p className="text-xs md:text-base font-light">
        Get unbeatable deals on the newest gadgets and devices. Up to 50% off!
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 transition-all ease-in-out px-6 py-2 text-white rounded-md mt-4 md:mt-6 text-xs md:text-sm">
        SHOP ELECTRONICS
      </button>
    </div>
  </div>
      </div>

      <div className="feature flex md:flex-row flex-col items-center flex-wrap justify-between  md:space-y-10 space-y-8 space-x-4">
          {featuring.map((feature, index) => (
            <div key={index} className='flex flex-col items-center'>
              <img src={feature.img} alt="" className="w-8 mb-4 text-center" />
              <p className='text-lg font-bold'>{feature.title}</p>
              <p>{feature.info}</p>
            </div>
          ))}
      </div>
      </div>
    </>
  )
}

export default Home