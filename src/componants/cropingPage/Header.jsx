import React from 'react'
import { Link } from 'react-router'

export const HeaderM = () => {
  return (
    <>
        <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
            <span className="text-xl font-bold">PDFCropper</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/tools" className="text-gray-600 hover:text-gray-900">Tools</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </nav>
      </header>
    </>
  )
}

