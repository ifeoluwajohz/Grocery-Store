import React from 'react'
import { Link } from 'react-router-dom'


const MenuBar: React.FC = () => {
  return (
    <div>
      <Link to='/' className='text-xl font-bold'>Zorra</Link>
    </div>
  )
}

export default MenuBar