import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Discountslider from './components/Discountslider';
import Categories from './pages/Categories/Categories.jsx';
import BranchPage from './pages/Branches/BranchesPage';
import UserPage from './pages/Branches/UserPage';
import OffersAndDiscountsPage from './pages/OffersAndDiscounts/offer&discount.jsx';
import WarehouseDetails from './pages/Warehouses/WarehouseDetails';
import WarehousesPage from './pages/Warehouses/WarehousesPage.jsx';
import TablePage from './pages/Branches/TablePage';
import CategoryItemsPage from './pages/Categories/CategoryItemsPage.jsx';
import CategoriesPage from './pages/Categories/CategoriesPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import TaxesPage from './pages/Tax/TaxesPage.jsx';
import InvoicesPage from './pages/Branches/invoice.jsx';
import BranchRatesPage from './pages/Branches/rate.jsx';

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
          <Route path="/descount" element={<OffersAndDiscountsPage />} />

          {/* صفحات الفروع */}
          <Route path="/branches/:branchId/table" element={<TablePage />} />
          <Route path="/branches/:branchId/user" element={<UserPage />} />
          <Route path="/branches/:branchId/invoice" element={<InvoicesPage />} />
          <Route path="/branches/:branchId/rate" element={<BranchRatesPage />} />

          {/* مستودعات مرتبطة بفرع */}
          <Route path="/branches/:branchId/warehouse" element={<WarehousesPage />} />
          <Route path="/branches/:branchId/warehouse/:warehouseId" element={<WarehouseDetails />} />

          <Route path="/categories/:id" element={<CategoryItemsPage />} />
          <Route path="/tax" element={<TaxesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
