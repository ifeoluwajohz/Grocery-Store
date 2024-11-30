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
  const [error, setError] = useState(null)
  const [products, setProducts] = useState<Produce[]>([])
  const featuring: Features[] = features.features;

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true)
      try{
        const response = await fetch(`http://localhost:3600/products/category/CLOTHING`);
        const data = await response.json()
        setProducts(data.products)
      }catch(err){
        setError(err.message)
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
      <img className=' object-none h-96 w-full' src="https://images.unsplash.com/photo-1685504513848-df0dd6893cec?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />

        <div className="lg:text-black text-white absolute top-12 md:left-8 left-0 md:top-5 space-y-8 lg:w-1/3 w-full md:text-left text-center">
          <p className="font-normal text-xl">ALL NATURAL PRODUCTS</p>
          <p className="font-bold text-4xl leading-tight">Fresh and Healthy Veggies <span className="font-light">Organic Market</span></p>
          <p className="text-xs">Lorem ipsum, dolor sit amet consectetur adipisicing elit hello temporibus assumenda maxime incidunt.</p>

          <div className="">
            <button className='bg-green-500 hover:bg-green-500 transition-all ease-in-out px-6 py-2 text-white rounded-md text-xs'>SHOP NOW</button>
          </div>
        </div>
      </div>
      <div className="top-saver my-10">
        <h1 className="text-2xl"><span className='underline'>Top</span> Saver Today</h1>
        {loading && <p>Loading ...</p>}
        {error &&  <p className="text-red-300">{error}</p>}
        <div className=" flex space-x-8 py-4 flex-wrap text-left items-start justify-start mt-5">
          {products.map((product) => (
            <Link to={`product/${product.id}`} key={product.id} className='flex '>
              <div>
                <button className='bg-green-500 text-xs px-3 py-1 text-white'>50% off</button>
                <p>{product.name}</p>
                <p className='text-sm text-black font-semibold mt-2'>$ <span className='text-sm text-green-400 font-bold'>{product.price}</span></p>
              </div>
              <img src={product.image} alt="Fresh veggies" className="relative" />
            </Link>
          ))}
        </div>
      </div> 
      <div className=" lg:text-black text-white flyer my-10 relative group">
        <img className='h-64 w-full object-none -z-10'  src='https://images.unsplash.com/photo-1685504513848-df0dd6893cec?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
        <div className=" text-center absolute top-16 left-20 md:left-10 z-10">
          <p className="text-base font-medium">ALL TESTED PRODUCTS</p>
          <p className="text-2xl font-bold">Beauty & Personal Care</p>
          <p className="text-lg font-light">Up to 70% Off</p>
          <button className="bg-green-500 text-xs py-2 px-5 text-white rounded-sm mt-8">SHOP NOW</button>
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