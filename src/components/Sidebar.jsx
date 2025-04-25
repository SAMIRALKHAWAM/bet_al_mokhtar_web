import React from 'react'
import { Home, User, Percent, Database, LogOut, LayoutGrid ,ForkKnife} from 'lucide-react';
const Sidebar = () => {
    return (
        <div className="bg-gradient-to-b from-red-800 to-red-500 text-white
         w-40 min-h-screen flex flex-col items-center py-20 space-y-10 rounded-tr-2xl rounded-2xl m-8">
          <ForkKnife size={28} />
          <button><Home size={24} /></button>
          <button><User size={24} /></button>
          <button><Percent size={24} /></button>
          <button><Database size={24} /></button>
          <button><LogOut size={24} /></button>
        </div>
      );
}

export default Sidebar
