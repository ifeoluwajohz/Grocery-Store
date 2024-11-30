import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { useAuth } from './context/AuthContext'


import Navbar from "./components/Navbar"
import Home from './components/Home'
import ProductDetail from './components/ProductDetail'
import ProductCategory from './components/ProductCategory'
import SignInComponent from './utils/SignInComponent'


const App = () => {
  const {user} = useAuth();
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/login' element={!user ? <SignInComponent /> : <Home/>} />
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