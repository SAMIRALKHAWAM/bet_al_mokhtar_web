import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Discountslider from '../components/Discountslider'
import Categories from './Categories/Categories'
import React from 'react'

const AdminDashboard = () => {
  return (
   <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
              <Header />
              <Discountslider />
              <Categories />
      </div>
    </div>
  )
}

export default AdminDashboard
