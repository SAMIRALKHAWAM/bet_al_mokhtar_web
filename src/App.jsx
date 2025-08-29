import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import PublicMenu from './pages/PublicMenu.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import CashierPage from './pages/Cashier/CashierPage.jsx';
import InvoicePrintView from './pages/Cashier/InvoicePrintView.jsx';

import AdminDashboard from './pages/AdminDashboard.jsx';
import WarehouseManagerPage from './pages/WarehouseManger/WarehouseManagerPage.jsx';

import BranchPage from './pages/Branches/BranchesPage.jsx';
import CategoriesPage from './pages/Categories/CategoriesPage.jsx';
import OffersAndDiscountsPage from './pages/OffersAndDiscounts/offer&discount.jsx';
import BranchOffersAndDiscountsPage from './pages/OffersAndDiscounts/subadmin_offer.jsx';
import TaxesPage from './pages/Tax/TaxesPage.jsx';

import TablePage from './pages/Branches/TablePage.jsx';
import InvoicesPage from './pages/Branches/invoice.jsx';
import BranchRatesPage from './pages/Branches/rate.jsx';
import WarehousesPage from './pages/Warehouses/WarehousesPage.jsx';
import WarehouseDetails from './pages/Warehouses/WarehouseDetails.jsx';
import UserPage from './pages/Branches/UserPage.jsx';

import CategoryItemsPage from './pages/Categories/CategoryItemsPage.jsx';

import AccountantDashboard from './pages/Accountent/AccountantDashboard.jsx';

import WarehouseMaterialsPage from './pages/WarehouseMaterialsPage.jsx'

const App = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const sharedBranchRoutes = [
    { path: '/branches/:branchId/table', element: <TablePage /> },
    { path: '/branches/:branchId/user', element: <UserPage /> },
    { path: '/branches/:branchId/invoice', element: <InvoicesPage /> },
    { path: '/branches/:branchId/rate', element: <BranchRatesPage /> },
    { path: '/branches/:branchId/warehouse', element: <WarehousesPage /> },
    { path: '/branches/:branchId/warehouse/:warehouseId', element: <WarehouseDetails /> },
    { path: '/branches/:branchId/categories', element: <CategoriesPage /> },
    
    { path: '/branches/:branchId/descount', element: <BranchOffersAndDiscountsPage /> },
    { path: '/branches/:branchId/tax', element: <TaxesPage /> },
  ];

  return (
    <div className="flex">
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* صفحة البداية */}
          <Route
            path="/"
            element={
              user ? (
                user.type === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : user.type === 'subadmin' ? (
                  <Navigate to={`/admin`} replace />
                ) : user.type === 'branch_manager' ? (
                  // ✅ توجيه مدير الفرع على صفحة الخصومات الخاصة بفرعو
                  <Navigate to={`/branches/${user.branchId}/descount`} replace />
                ) : user.type === 'cashier' ? (
                  <Navigate to="/cashier" replace />
                ) : user.type === 'warehouseman' ? (
                  <Navigate to="/warehouse-manager" replace />
                ) : user.type === 'accountant' ? (
                  <Navigate to="/dashboard/accounting" replace />
                ) : (
                  <Navigate to="/unauthorized" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* الكاشير */}
          <Route
            path="/cashier"
            element={
              <ProtectedRoute element={<CashierPage />} allowedTypes={['cashier']} />
            }
          />
          <Route
            path="/cashier/print/:id"
            element={
              <ProtectedRoute element={<InvoicePrintView />} allowedTypes={['cashier']} />
            }
          />

          {/* المحاسب */}
          <Route
            path="/dashboard/accounting"
            element={
              <ProtectedRoute
                element={<AccountantDashboard />}
                allowedTypes={['accountant']}
              />
            }
          />

          {/* مسؤول المستودع */}
          <Route
            path="/warehouse-manager"
            element={
              <ProtectedRoute
                element={<WarehouseManagerPage />}
                allowedTypes={['warehouseman']}
              />
            }
          />

          {/* الأدمن */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                allowedTypes={['admin', 'subadmin']}
              />
            }
          />

          {/* صفحات الفروع للأدمن */}
          <Route
            path="/branch"
            element={
              <ProtectedRoute element={<BranchPage />} allowedTypes={['admin']} />
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute element={<CategoriesPage />} allowedTypes={['admin']} />
            }
          />

          <Route
            path="/Materials"
            element={
              <ProtectedRoute element={<WarehouseMaterialsPage />} allowedTypes={['admin']} />
            }
          />

        
          <Route
            path="/descount"
            element={
              <ProtectedRoute
                element={<OffersAndDiscountsPage />}
                allowedTypes={['admin', 'subadmin']}
              />
            }
          />

          <Route
            path="/tax"
            element={
              <ProtectedRoute element={<TaxesPage />} allowedTypes={['admin']} />
            }
          />

          {/* ✅ صفحات مشتركة للفروع (admin + subadmin + branch_manager) */}
          {sharedBranchRoutes.map(({ path, element }, index) => (
            <Route
              key={index}
              path={path}
              element={
                <ProtectedRoute
                  element={element}
                  allowedTypes={['admin', 'subadmin', 'branch_manager']}
                />
              }
            />
          ))}

          <Route
            path="/categories/:id"
            element={
              <ProtectedRoute
                element={<CategoryItemsPage />}
                allowedTypes={['admin', 'subadmin']}
              />
            }
          />

          <Route path="/menu" element={<PublicMenu />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
