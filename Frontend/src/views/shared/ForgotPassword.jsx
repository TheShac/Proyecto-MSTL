import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from './services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await authService.forgotPassword(email.trim());
      setResult(res);
    } catch (err) {
      setError(err.message || 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 460 }}>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <h3 className="fw-bold mb-1">Recuperar contraseña</h3>
          <p className="text-muted small mb-4">
            Ingresa tu email y te enviaremos un enlace para restablecerla.
          </p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {result ? (
            <div className="alert alert-success">
              <div className="mb-2">{result.message}</div>
              {result.demo && result.token && (
                <>
                  <hr />
                  <p className="small mb-2">
                    <b>Modo demo:</b> como no hay servidor de correo, usa este enlace
                    para restablecer tu contraseña:
                  </p>
                  <Link to={`/reset-password?token=${result.token}`} className="btn btn-sm btn-warning">
                    Restablecer contraseña
                  </Link>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          )}

          <div className="text-center mt-3">
            <Link to="/login" className="small text-decoration-none">
              <i className="bi bi-arrow-left me-1" /> Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
