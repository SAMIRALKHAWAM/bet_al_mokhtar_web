// src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import PublicMenu from './pages/PublicMenu.jsx'



import LoginPage from './pages/Auth/LoginPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import CashierPage from './pages/Cashier/CashierPage.jsx'
import InvoicePrintView from './pages/Cashier/InvoicePrintView.jsx'

import AdminDashboard from './pages/AdminDashboard.jsx'
import WarehouseManagerPage from './pages/WarehouseManger/WarehouseManagerPage.jsx'


import BranchPage from './pages/Branches/BranchesPage.jsx'
import CategoriesPage from './pages/Categories/CategoriesPage.jsx'
import OffersAndDiscountsPage from './pages/OffersAndDiscounts/offer&discount.jsx'
import TaxesPage from './pages/Tax/TaxesPage.jsx'


import TablePage from './pages/Branches/TablePage.jsx'
import InvoicesPage from './pages/Branches/invoice.jsx'
import BranchRatesPage from './pages/Branches/rate.jsx'
import WarehousesPage from './pages/Warehouses/WarehousesPage.jsx'
import WarehouseDetails from './pages/Warehouses/WarehouseDetails.jsx'
import UserPage from './pages/Branches/UserPage.jsx'

import SettingsPage from './pages/SettingsPage.jsx'
import CategoryItemsPage from './pages/Categories/CategoryItemsPage.jsx'

const App = () => {
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
     localStorage.removeItem('user');
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])


  const sharedBranchRoutes = [
    { path: '/branches/:branchId/table', element: <TablePage /> },
    { path: '/branches/:branchId/user', element: <UserPage /> },
    { path: '/branches/:branchId/invoice', element: <InvoicesPage /> },
    { path: '/branches/:branchId/rate', element: <BranchRatesPage /> },
    { path: '/branches/:branchId/warehouse', element: <WarehousesPage /> },
    { path: '/branches/:branchId/warehouse/:warehouseId', element: <WarehouseDetails /> },
    { path: '/branches/:branchId/categories', element: <CategoriesPage /> },
    { path: '/branches/:branchId/descount', element: <OffersAndDiscountsPage /> },
    { path: '/branches/:branchId/tax', element: <TaxesPage /> },
    { path: '/settings', element: <SettingsPage /> }
  ]

  return (
    <div className="flex">
      <div className="flex-1">
        <Routes>
        
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              user ? (
                user.type === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : user.type === 'subadmin' ? (
                  <Navigate to={`/branches/${user.branchId}/table`} replace />
                ) : user.type === 'cashier' ? (
                  <Navigate to="/cashier" replace />
                ) : user.type === 'warehouseman' ? (
                  <Navigate to="/warehouse-manager" replace />
                ) : (
                  <Navigate to="/unauthorized" replace />
                )
              ) 
              : 
              (
                <Navigate to="/login" replace />
              )
            }
          />

       
          <Route path="/cashier" element={<CashierPage />} />
          <Route path="/cashier/print/:id" element={<InvoicePrintView />} />

         
          <Route
            path="/warehouse-manager"
            element={
              <ProtectedRoute
                element={<WarehouseManagerPage />}
                allowedTypes={['warehouseman']}
              />
            }
          />

     
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                allowedTypes={['admin', 'subadmin']}
              />
            }
          />

         
          <Route
            path="/branch"
            element={
              <ProtectedRoute
                element={<BranchPage />}
                allowedTypes={['admin']}
              />
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute
                element={<CategoriesPage />}
                allowedTypes={['admin']}
              />
            }
          />
          <Route
            path="/descount"
            element={
              <ProtectedRoute
                element={<OffersAndDiscountsPage />}
                allowedTypes={['admin']}
              />
            }
          />
          <Route
            path="/tax"
            element={
              <ProtectedRoute
                element={<TaxesPage />}
                allowedTypes={['admin']}
              />
            }
          />

          
          {sharedBranchRoutes.map(({ path, element }, index) => (
            <Route
              key={index}
              path={path}
              element={
                <ProtectedRoute
                  element={element}
                  allowedTypes={['admin', 'subadmin']}
                />
              }
            />
          ))}

        
          <Route path="/categories/:id" element={<CategoryItemsPage />} />

          <Route path="/menu" element={<PublicMenu />} />

         
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
