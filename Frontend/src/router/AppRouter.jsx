import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Navbar from '../components/Navbar';
import AdminLayout from '../layouts/AdminLayout';
import ClientLayout from "../layouts/ClientLayout";

// Vistas Cliente
import Dashboard from '../views/client/Dashboard';
import Profile from '../views/client/Profile';
import CustomerCatalog from "../views/client/catalogo/CustomerCatalog";
import ProductDetail from "../views/client/products/ProductDetail";

// Vistas Admin
import DashboardAdmin from '../views/admin/DashboardAdmin';
import AdminProducts from '../views/admin/products/AdminProducts';
import AdminEmployees from '../views/admin/employees/AdminEmployees';
import AdminInventory from '../views/admin/inventory/AdminInventory';
import AdminOrders from '../views/admin/orders/AdminOrders';
import AdminAnaliticas from '../views/admin/AdminAnaliticas';
import AdminClients from '../views/admin/AdminClients';
import AdminConfiguration from '../views/admin/AdminConfiguration';
import AdminAProfile from '../views/admin/profile/AdminProfile';

// Auth
import Login from '../views/shared/Login';
import Register from '../views/shared/Register';
import GoogleSuccess from '../views/shared/GoogleSuccess';

// Contexto de autenticación
import { useAuth } from '../stores/AuthContext';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  return auth.isLoggedIn ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const auth = useAuth();
  return auth.isAdmin ? children : <Navigate to="/" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/catalogo" element={<CustomerCatalog />} />
        <Route path="/catalogo/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ✅ CALLBACK GOOGLE */}
      <Route path="/auth/google/success" element={<GoogleSuccess />} />

      {/* RUTAS ADMIN (PRIVADAS + ADMIN) */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="analytics" element={<AdminAnaliticas />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="configuration" element={<AdminConfiguration />} />
        <Route path="profile" element={<AdminAProfile />} />
      </Route>

      {/* RUTA POR DEFECTO */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
