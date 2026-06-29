import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ClientLayout from "../layouts/ClientLayout";

// Vistas Cliente
import Dashboard from '../views/client/Dashboard';
import Profile from '../views/client/Profile';
import CustomerCatalog from "../views/client/catalogo/CustomerCatalog";
import ProductDetail from "../views/client/products/ProductDetail";
import CheckoutRouter from "../views/client/orders/CheckoutRouter";
import TrackOrderPage from "../views/client/orders/pages/TrackOrderPage";

// Vistas Admin (lazy: solo se cargan al entrar al panel admin)
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const DashboardAdmin = lazy(() => import('../views/admin/dashboard/DashboardAdmin'));
const AdminProducts = lazy(() => import('../views/admin/products/AdminProducts'));
const AdminEmployees = lazy(() => import('../views/admin/employees/AdminEmployees'));
const AdminInventory = lazy(() => import('../views/admin/inventory/AdminInventory'));
const AdminOrders = lazy(() => import('../views/admin/orders/AdminOrders'));
const AdminAnaliticas = lazy(() => import('../views/admin/analytics/AdminAnaliticas'));
const AdminClients = lazy(() => import('../views/admin/clients/AdminClients'));
const AdminConfiguration = lazy(() => import('../views/admin/configuration/AdminConfiguration'));
const AdminAProfile = lazy(() => import('../views/admin/profile/AdminProfile'));
const AdminReviews = lazy(() => import('../views/admin/reviews/AdminReviews'));
const AdminShipping = lazy(() => import('../views/admin/shipping/AdminShipping'));

// Auth
import Login from '../views/shared/Login';
import Register from '../views/shared/Register';
import GoogleSuccess from '../views/shared/GoogleSuccess';
import ForgotPassword from '../views/shared/ForgotPassword';
import ResetPassword from '../views/shared/ResetPassword';

// Contexto de autenticación
import { useAuth } from '../stores/AuthContext';

const SuspenseFallback = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <div className="spinner-border text-warning" role="status" />
  </div>
);

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
        <Route path="/finalizar-compra" element={<CheckoutRouter />} />
        <Route path="/seguimiento" element={<TrackOrderPage />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/mis-pedidos" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ✅ CALLBACK GOOGLE */}
      <Route path="/auth/google/success" element={<GoogleSuccess />} />

      {/* RUTAS ADMIN (PRIVADAS + ADMIN, cargadas bajo demanda) */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminRoute>
              <Suspense fallback={<SuspenseFallback />}>
                <AdminLayout />
              </Suspense>
            </AdminRoute>
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Suspense fallback={<SuspenseFallback />}><DashboardAdmin /></Suspense>} />
        <Route path="products" element={<Suspense fallback={<SuspenseFallback />}><AdminProducts /></Suspense>} />
        <Route path="inventory" element={<Suspense fallback={<SuspenseFallback />}><AdminInventory /></Suspense>} />
        <Route path="orders" element={<Suspense fallback={<SuspenseFallback />}><AdminOrders /></Suspense>} />
        <Route path="employees" element={<Suspense fallback={<SuspenseFallback />}><AdminEmployees /></Suspense>} />
        <Route path="analytics" element={<Suspense fallback={<SuspenseFallback />}><AdminAnaliticas /></Suspense>} />
        <Route path="clients" element={<Suspense fallback={<SuspenseFallback />}><AdminClients /></Suspense>} />
        <Route path="configuration" element={<Suspense fallback={<SuspenseFallback />}><AdminConfiguration /></Suspense>} />
        <Route path="reviews" element={<Suspense fallback={<SuspenseFallback />}><AdminReviews /></Suspense>} />
        <Route path="shipping" element={<Suspense fallback={<SuspenseFallback />}><AdminShipping /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<SuspenseFallback />}><AdminAProfile /></Suspense>} />
      </Route>

      {/* RUTA POR DEFECTO */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
