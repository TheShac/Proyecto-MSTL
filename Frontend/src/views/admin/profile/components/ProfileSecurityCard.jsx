import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { profileService } from '../services/profile.service';

const ProfileSecurityCard = ({ token }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const submit = async () => {
    if (!currentPassword || !newPassword || !confirm) {
      Swal.fire('Error', 'Completa todos los campos.', 'error');
      return;
    }
    if (newPassword !== confirm) {
      Swal.fire('Error', 'La confirmación no coincide.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await profileService.changePassword({ currentPassword, newPassword }, token);
      Swal.fire('Éxito', 'Contraseña actualizada.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || 'No se pudo actualizar.';
      Swal.fire('Error', msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        <h5 className="mb-1">Seguridad</h5>
        <p className="text-muted mb-3">Gestiona tu contraseña y seguridad de cuenta</p>

        <div className="mb-3">
          <label className="form-label fw-semibold">Contraseña actual</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>

        <button className="btn btn-outline-dark mt-3" onClick={submit} disabled={isSaving}>
          {isSaving && <span className="spinner-border spinner-border-sm me-2" />}
          Cambiar contraseña
        </button>
      </div>
    </div>
  );
};

export default ProfileSecurityCard;
