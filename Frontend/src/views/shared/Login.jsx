import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../stores/AuthContext';

const Login = () => {
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

      auth.login({
        accessToken: token,
        role,
        userType,
        id,
        username,
      });

      localStorage.setItem('accessToken', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userType', userType);

      // Redirección según tipo de usuario
      if (userType === 'employee') {
        const adminRoles = [
          'stl_administrador',
          'stl_superadministrador',
          'stl_emp',
        ];

        if (adminRoles.includes(role)) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }

    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Credenciales inválidas. Verifica tus datos.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Google Login: redirige al backend
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light pt-5">
      <div
        className="w-100 p-4 bg-white rounded-lg shadow-lg border border-gray-100"
        style={{ maxWidth: '380px' }}
      >
        <h2 className="text-center text-dark mb-4">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="identifier" className="form-label text-dark">
              Email o Nombre de Usuario
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="Escribe tu email o usuario"
              required
              className="form-control form-control-lg"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-dark">
              Contraseña
            </label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Escribe tu contraseña"
                required
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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

        {/* ✅ BOTÓN GOOGLE */}
        <button
          type="button"
          className="btn btn-outline-dark w-100 fw-bold py-2 mt-3"
          onClick={handleGoogleLogin}
        >
          <i className="bi bi-google me-2"></i>
          Continuar con Google
        </button>

        <div className="mt-4 text-center small">
          <p className="text-muted">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-warning fw-bold">
              Crear una
            </Link>
          </p>
          <p className="mt-1">
            <Link to="/forgot-password" className="text-secondary">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>

        {error && (
          <div className="alert alert-danger mt-3 small">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Login;
