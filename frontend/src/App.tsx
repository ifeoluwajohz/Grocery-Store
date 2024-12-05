import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { useAuth } from './context/AuthContext'

import MenuBar from "./components/MenuBar"
import Navbar from "./components/Navbar"
import Home from './components/Home'
import WishlistPage from './components/WishlistPage'
import ProductDetail from './components/ProductDetail'
import ProductCategory from './components/ProductCategory'
import SignInComponent from './utils/SignInComponent'
import AccountPage from './utils/AccountPage'

const App = () => {
  const {user} = useAuth();
  return (
    <>
      <Router>
        <MenuBar />
        <Navbar />
        <Routes>
          <Route path='/login' element={!user ? <SignInComponent /> : <Home/>} />
          <Route path='/account' element={ <AccountPage /> } />

        </Routes>

          <Routes>
            <Route path='/wishlist' element={!user ? <SignInComponent /> : <WishlistPage/>} />
          </Routes>

        <Routes>
          <Route path='/' element={<Home />}/>
        </Routes>
        <Routes>
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/category/:category' element={<ProductCategory />} />

        </Routes>
      </Router>
      {/* <SearchBar /> */}
    </>
  )
}

export default App