import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from './services/authService';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();

  const [pwd, setPwd] = useState({ nueva: '', repetir: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (pwd.nueva.length < 6) {
      return setMsg({ type: 'danger', text: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    if (pwd.nueva !== pwd.repetir) {
      return setMsg({ type: 'danger', text: 'Las contraseñas no coinciden.' });
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, pwd.nueva);
      setDone(true);
      setMsg({ type: 'success', text: 'Contraseña actualizada. Redirigiendo al login...' });
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setMsg({ type: 'danger', text: err.message || 'No se pudo restablecer la contraseña.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 460 }}>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <h3 className="fw-bold mb-1">Nueva contraseña</h3>
          <p className="text-muted small mb-4">Define tu nueva contraseña.</p>

          {!token ? (
            <div className="alert alert-danger">
              Enlace inválido o incompleto.{' '}
              <Link to="/forgot-password">Solicita uno nuevo</Link>.
            </div>
          ) : (
            <>
              {msg && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

              {!done && (
                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nueva contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={pwd.nueva}
                      onChange={(e) => setPwd((p) => ({ ...p, nueva: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Repetir contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={pwd.repetir}
                      onChange={(e) => setPwd((p) => ({ ...p, repetir: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={loading}>
                    {loading ? 'Guardando...' : 'Restablecer contraseña'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
