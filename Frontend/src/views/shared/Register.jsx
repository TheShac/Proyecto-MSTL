import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(
        'http://localhost:3000/api/auth/register/customer',
        form
      );

      setSuccess(
        'Registro exitoso. Serás redirigido para iniciar sesión.'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registro Error:', err);
      setError(
        err.response?.data?.message ||
          'Error al registrar. Intenta con otro email o usuario.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center bg-light pt-5 pb-5"
      style={{ minHeight: '100vh' }}
    >
      <div
        className="w-100 p-4 bg-white rounded-lg shadow-lg border border-gray-100"
        style={{ maxWidth: '500px' }}
      >
        <h2 className="text-center text-dark mb-4">
          Crear Cuenta de Cliente
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-sm-6">
              <label htmlFor="nombre" className="form-label text-dark">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                required
                className="form-control"
                value={form.nombre}
                onChange={handleChange('nombre')}
              />
            </div>
            <div className="col-sm-6">
              <label htmlFor="apellido" className="form-label text-dark">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                required
                className="form-control"
                value={form.apellido}
                onChange={handleChange('apellido')}
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="username"
              className="form-label text-dark"
            >
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              required
              className="form-control"
              value={form.username}
              onChange={handleChange('username')}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-dark">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="form-control"
              value={form.email}
              onChange={handleChange('email')}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="form-label text-dark"
            >
              Contraseña
            </label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-control"
                value={form.password}
                onChange={handleChange('password')}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={
                  showPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
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
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-4 text-center small">
          <p className="text-muted">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-warning fw-bold">
              Iniciar Sesión
            </Link>
          </p>
        </div>

        {error && (
          <div className="alert alert-danger mt-3 small">{error}</div>
        )}
        {success && (
          <div className="alert alert-success mt-3 small">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
