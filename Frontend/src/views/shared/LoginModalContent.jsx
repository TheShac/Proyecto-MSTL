import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../stores/AuthContext';

const LoginModalContent = ({ onSuccess, switchToRegister }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        identifier,
        password,
      });

      const { token, role, userType, id, username } = response.data;

      auth.login({ accessToken: token, role, userType, id, username });

      localStorage.setItem('accessToken', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userType', userType);

      // ✅ cerrar modal
      onSuccess();

      // ✅ redireccion igual que tu login normal
      if (userType === 'employee') {
        const adminRoles = ['stl_administrador', 'stl_superadministrador', 'stl_emp'];

        if (adminRoles.includes(role)) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Credenciales inválidas. Verifica tus datos.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="identifier" className="form-label text-dark">
            Email o Nombre de Usuario
          </label>
          <input
            id="identifier"
            type="text"
            required
            className="form-control"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label text-dark">
            Contraseña
          </label>
          <div className="input-group">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              <i className={showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-warning text-white w-100 fw-bold py-2"
        >
          {isLoading ? 'Iniciando...' : 'Entrar'}
        </button>
      </form>

      <button
        type="button"
        className="btn btn-outline-dark w-100 fw-bold py-2 mt-3"
        onClick={handleGoogleLogin}
      >
        <i className="bi bi-google me-2"></i>
        Continuar con Google
      </button>

      {error && <div className="alert alert-danger mt-3 small">{error}</div>}

      <div className="mt-3 text-center small">
        ¿No tienes cuenta?{' '}
        <button type="button" className="btn btn-link p-0" onClick={switchToRegister}>
          Crear una
        </button>
      </div>
    </>
  );
};

export default LoginModalContent;
