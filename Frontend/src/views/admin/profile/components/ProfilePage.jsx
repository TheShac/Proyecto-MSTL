import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import ProfileSidebarCard from './ProfileSidebarCard';
import ProfilePersonalForm from './ProfilePersonalForm';
import ProfileActivityCard from './ProfileActivityCard';
import ProfileSecurityCard from './ProfileSecurityCard';

import { profileService } from '../services/profile.service';

const mapRoleLabel = (raw) => {
  const m = {
    stl_superadministrador: 'Super Administrador',
    stl_administrador: 'Administrador',
    stl_emp: 'Empleado',
  };
  return m[raw] || raw || 'N/A';
};

const ProfilePage = () => {
  const token = useMemo(
    () => localStorage.getItem('accessToken') || localStorage.getItem('token') || '',
    []
  );

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMe = async () => {
    setIsLoading(true);
    try {
      const res = await profileService.me(token);
      setData(res?.data || null);
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'No se pudo cargar el perfil.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = async (payload) => {
    setIsSaving(true);
    try {
      // payload trae: { nombre, apellido, telefono } (si luego haces update user)
      // y address: { direccion, ciudad, pais, codigo_postal }
      await profileService.saveAddress(payload.address, token);

      // Si más adelante agregas endpoint para actualizar datos personales,
      // acá lo llamas también.

      await fetchMe();
      Swal.fire('Éxito', 'Perfil actualizado.', 'success');
      setEditMode(false);
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || 'No se pudo guardar.';
      Swal.fire('Error', msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body py-5 text-center">
            <div className="spinner-border text-warning" role="status" />
            <div className="text-muted mt-2">Cargando perfil...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const fullName = `${data.nombre || ''} ${data.apellido || ''}`.trim();
  const roleLabel = mapRoleLabel(data.role);

  return (
    <div className="profile-page p-4">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
        <div>
          <h2 className="mb-1">Mi Perfil</h2>
          <p className="text-muted mb-0">Administra tu información personal</p>
        </div>

        <button
          className="btn btn-dark"
          onClick={() => setEditMode(true)}
          disabled={editMode || isSaving}
        >
          Editar Perfil
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-4">
          <ProfileSidebarCard
            name={fullName || '—'}
            roleLabel={roleLabel}
            email={data.email || '—'}
            image={data.image_profile}
            lastLogin={data.last_login}
            editMode={editMode}
          />

          <div className="mt-4">
            <ProfileActivityCard
              productsCreated={data?.stats?.productsCreated ?? 0}
              lastLogin={data.last_login}
            />
          </div>
        </div>

        <div className="col-12 col-xl-8">
          <ProfilePersonalForm
            data={data}
            roleLabel={roleLabel}
            editMode={editMode}
            isSaving={isSaving}
            onCancel={() => setEditMode(false)}
            onSave={onSave}
          />

          <div className="mt-4">
            <ProfileSecurityCard token={token} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
