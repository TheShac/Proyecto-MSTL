import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles/Sidebar.css';

const SidebarAuth = ({ open, onClose }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (!open) return null;

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        identifier,
        password,
      });

      localStorage.setItem('accessToken', res.data.accessToken);

      onClose();
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error de inicio de sesión');
    }
  };

  const goRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div
      className="fixed-top vw-100 vh-100 d-flex"
      style={{ zIndex: 1050 }}
    >
      {/* Overlay oscuro */}
      <div
        className="w-100 h-100 bg-dark bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Panel lateral */}
      <aside
        className="ms-auto bg-white h-100 shadow-lg p-4 sidebar-panel"
        style={{ width: '320px', maxWidth: '90%' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 fw-bold mb-0">Iniciar Sesión</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-light p-1"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="d-grid gap-3">
          <input
            type="text"
            placeholder="Email o usuario"
            className="form-control form-control-lg"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="form-control form-control-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            className="btn btn-warning text-white fw-bold py-2"
          >
            Entrar
          </button>

          <p className="text-center small text-muted mt-2">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              className="btn btn-link p-0 text-warning fw-bold"
              onClick={goRegister}
            >
              Crear una
            </button>
          </p>
        </div>
      </aside>
    </div>
  );
};

export default SidebarAuth;
