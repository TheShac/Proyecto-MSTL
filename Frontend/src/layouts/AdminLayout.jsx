// src/layouts/AdminLayout.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/AuthContext';
import './Styles/AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const logout = () => {
    auth.logout();
    // En Vue: router.push({ name: 'Dashboard' })
    // Aquí asumo que el dashboard público está en "/"
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setSidebarOpen(!isMobile);
  }, []);

  return (
    <div
      className={`d-flex ${!sidebarOpen ? 'toggled' : ''}`}
      id="wrapper"
    >
      {/* SIDEBAR */}
      <div className="bg-dark text-white border-end" id="sidebar-wrapper">
        <div className="sidebar-heading bg-warning text-dark fw-bold text-center py-3">
          MangaStore Admin
        </div>

        <div className="list-group list-group-flush flex-grow-1">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `list-group-item list-group-item-action bg-dark text-white ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `list-group-item list-group-item-action bg-dark text-white ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className="bi bi-box-seam me-2"></i>
            Productos
          </NavLink>

          <NavLink
            to="/admin/inventory"
            className={({ isActive }) =>
              `list-group-item list-group-item-action bg-dark text-white ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className="bi bi-boxes me-2"></i>
            Inventario
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `list-group-item list-group-item-action bg-dark text-white ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className="bi bi-journal-text me-2"></i>
            Pedidos
          </NavLink>

          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `list-group-item list-group-item-action bg-dark text-white ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className="bi bi-graph-up me-2"></i>
            Estadisticas
          </NavLink>

          <NavLink
            to="/admin/clients"
            className={({ isActive }) =>
              `list-group-item list-group-item-action bg-dark text-white ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className="bi bi-people me-2"></i>
            Clientes
          </NavLink>

          <NavLink
            to="/admin/configuration"
            className={({ isActive }) =>
              `list-group-item list-group-item-action bg-dark text-white ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className="bi bi-gear me-2"></i>
            Configuración
          </NavLink>

          <hr className="text-secondary my-2 mx-3" />

          <NavLink
            to="/admin/employees"
            className={({ isActive }) =>
              `list-group-item list-group-item-action bg-dark text-white ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className="bi bi-person-workspace me-2"></i>
            Gestión de Usuarios
          </NavLink>

          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `list-group-item list-group-item-action bg-dark text-white ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className="bi bi-person me-2"></i>
            Mi Perfil
          </NavLink>

          <button
            type="button"
            className="list-group-item list-group-item-action bg-dark text-danger text-start"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </button>
        </div>

        <div className="p-3">
          <Link to="/" className="btn btn-outline-light w-100">
            Ver Tienda
          </Link>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div id="page-content-wrapper">
        <button
          className="btn btn-dark d-md-none m-3 shadow-sm"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list me-2"></i>
          Menú Admin
        </button>

        {/* Aquí se renderizan las rutas hijas de /admin */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
