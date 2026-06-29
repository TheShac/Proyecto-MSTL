import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../stores/ThemeContext';
import { useAuth } from '../../../stores/AuthContext';

const AdminConfiguration = () => {
  const { isDark, toggleTheme } = useTheme();
  const auth = useAuth();

  return (
    <div className="container-fluid py-4">
      <h1 className="display-6 fw-bold mb-1">Configuración</h1>
      <p className="text-muted mb-4">Preferencias del panel de administración</p>

      <div className="row g-4">
        {/* Apariencia */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-palette me-2" />
                Apariencia
              </h5>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">Tema {isDark ? 'oscuro' : 'claro'}</div>
                  <small className="text-muted">
                    Cambia entre modo claro y oscuro.
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={toggleTheme}
                >
                  <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon-stars'}`} />
                  {isDark ? 'Claro' : 'Oscuro'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cuenta */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-person-badge me-2" />
                Cuenta
              </h5>
              <ul className="list-unstyled mb-3">
                <li className="mb-1">
                  <span className="text-muted">Usuario: </span>
                  <span className="fw-semibold">{auth.username || '—'}</span>
                </li>
                <li className="mb-1">
                  <span className="text-muted">Rol: </span>
                  <span className="fw-semibold">{auth.role || '—'}</span>
                </li>
              </ul>
              <Link to="/admin/profile" className="btn btn-warning">
                <i className="bi bi-gear me-2" />
                Editar mi perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguration;
