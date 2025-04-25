import React from 'react'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Discountslider from './components/Discountslider';
import Categories from './components/Categories';
import MenuViewer from './components/MenuView';

const App = () => {
  return (
    <div className="flex">
      <MenuViewer />
      {/* <Sidebar />
      <div className="flex-1 p-4">
        <Header />
         <Discountslider />
         <Categories /> 
      </div> */}
    </div>
  );
}

export default App
