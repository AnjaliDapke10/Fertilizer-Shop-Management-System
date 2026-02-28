import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import Inventory from "./pages/inventory/Inventory";


import Customers from "./pages/customers/Customers";
import Reports from "./pages/reports/Reports";
import Suppliers from "./pages/suppliers/Suppliers";
import Purchases from "./pages/purchases/Purchase";

import Sales from "./pages/sales/Sales";


const AppRoutes = () => (
  <Routes>
    
    <Route path="/login" element={<Login />} />

    {/* PROTECTED + LAYOUT */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/products"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Products />
          </AppLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/inventory"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Inventory />
          </AppLayout>
        </ProtectedRoute>
      }
    />

   


    <Route
      path="/customers"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Customers />
          </AppLayout>
        </ProtectedRoute>
      }
    />



    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Reports />
          </AppLayout>
        </ProtectedRoute>
      }
    />

  <Route
      path="/suppliers"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Suppliers />
          </AppLayout>
        </ProtectedRoute>
      }
    />

      <Route
      path="/purchases"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Purchases />
          </AppLayout>
        </ProtectedRoute>
      }
    />

     

      <Route 
      path="/sales"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Sales />
          </AppLayout>
        </ProtectedRoute>
      }
    />


  </Routes>
);

export default AppRoutes;
