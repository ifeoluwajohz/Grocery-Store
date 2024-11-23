import React from 'react'
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'

const App: React.FC = () => {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        
      </Routes>

    </Router>
      <div>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis culpa quaerat neque consectetur quos veniam aperiam unde, ipsam quo obcaecati. Ut quod, earum magnam asperiores id est dolorum praesentium ex!</p>
      </div>
    </>
    
  )
}

export default App