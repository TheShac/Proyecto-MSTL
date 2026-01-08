import React, { useState } from 'react';
import axios from 'axios';

const RegisterModalContent = ({ onSuccess, switchToLogin }) => {
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
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post('http://localhost:3000/api/auth/register/customer', form);

      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');

      setTimeout(() => {
        onSuccess();
        switchToLogin();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Error al registrar. Intenta con otro email o usuario.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row g-2 mb-2">
          <div className="col-sm-6">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              required
              className="form-control"
              value={form.nombre}
              onChange={handleChange('nombre')}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              required
              className="form-control"
              value={form.apellido}
              onChange={handleChange('apellido')}
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            required
            className="form-control"
            value={form.username}
            onChange={handleChange('username')}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            type="email"
            required
            className="form-control"
            value={form.email}
            onChange={handleChange('email')}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <div className="input-group">
            <input
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

      {error && <div className="alert alert-danger mt-3 small">{error}</div>}
      {success && <div className="alert alert-success mt-3 small">{success}</div>}

      <div className="mt-3 text-center small">
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="btn btn-link p-0" onClick={switchToLogin}>
          Iniciar Sesión
        </button>
      </div>
    </>
  );
};

export default RegisterModalContent;
