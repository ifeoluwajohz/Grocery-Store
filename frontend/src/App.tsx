import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './components/Home'
import SignInComponent from './utils/SignInComponent'
import { useAuth } from './context/AuthContext'

const App = () => {
  const {user} = useAuth();
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/login' element={!user ? <SignInComponent /> : <Home/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App