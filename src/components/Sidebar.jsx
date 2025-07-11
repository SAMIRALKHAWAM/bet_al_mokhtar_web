import React from 'react';
import { Home, User, Tag, Database, LogOut, MapPin, Box, Users, DollarSign, Utensils, Layout, Settings, Receipt,Gift } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-red-800 to-red-500 text-white w-40 min-h-screen flex flex-col items-center py-20 space-y-10 rounded-tr-2xl rounded-2xl m-8">
      <Utensils size={28} /> 
      <button onClick={() => navigate('/')}><Home size={24} /></button>
      <button onClick={() => navigate('/branch')}><MapPin size={24} /></button>
      <button onClick={() => navigate('/categories')}><Layout size={24} /></button> 

      <button onClick={() => navigate('/descount')}><Gift size={24} /></button>
        <button onClick={() => navigate('/tax')}><Receipt size={24} /></button>
     
      <button onClick={() => navigate('/settings')}><Settings size={24} /></button> 
      <button><LogOut size={24} /></button>
    </div>
  );
}

export default Sidebar;
