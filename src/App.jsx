import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Discountslider from './components/Discountslider'
import Categories from './components/Categories'
import BranchPage from './components/BranchPage'
import UserPage from './components/UserPage'
import DescountPage from './components/DescountPage'
import WarehouseDetails from './components/WarehouseDetails'
import WarehousePage from './components/WarehousePage.jsx'
import TablePage from './components/TablePage'
import CategoryItemsPage from './components/CategoryItemsPage'
import CategoriesPage from './components/CategoriesPage'
import SettingsPage from './components/SettingsPage'


const App = () => {
  return (
    
      <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Discountslider />
              <Categories />
            </>
          } />
          <Route path="/branch" element={<BranchPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/descount" element={<DescountPage />} />
          <Route path="/warehouse" element={<WarehousePage />} />
  <Route path="/warehouse/:id" element={<WarehouseDetails />} />  
          <Route path="/table" element={<TablePage />} />
          <Route path="/branches/:branchId/table" element={<TablePage />} />
          <Route path="/branches/:id/user" element={<UserPage />} />
          <Route path="/categories/:id" element={<CategoryItemsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
    
    
  )
}

export default App
