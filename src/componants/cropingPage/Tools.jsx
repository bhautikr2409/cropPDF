import React from 'react'
import { Link } from 'react-router'

const Tools = () => {
  return (
    <>
      <div className='flex items-center justify-center mt-4'>
        <Link to='/crop' className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors duration-200 shadow-sm">Crop PDF</Link>
      </div>
    </>
  )
}

export default Tools
