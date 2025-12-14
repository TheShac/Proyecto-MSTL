import React, { useEffect, useState } from 'react';

const initial = (data) => ({
  nombre: data?.nombre || '',
  apellido: data?.apellido || '',
  username: data?.username || '',
  email: data?.email || '',
  telefono: data?.telefono || '',
  role: data?.role || '',
  address: {
    direccion: data?.address?.direccion || '',
    ciudad: data?.address?.ciudad || '',
    pais: data?.address?.pais || '',
    codigo_postal: data?.address?.codigo_postal || '',
  },
});

const ProfilePersonalForm = ({
  data,
  roleLabel,
  editMode,
  isSaving,
  onCancel,
  onSave,
  pendingImage,
}) => {
  const [form, setForm] = useState(() => initial(data));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial(data));
    setErrors({});
  }, [data, editMode]);

  const setField = (k) => (e) => {
    const v = e.target.value;
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => {
      if (!p[k]) return p;
      const c = { ...p };
      delete c[k];
      return c;
    });
  };

  const setAddr = (k) => (e) => {
    const v = e.target.value;
    setForm((p) => ({ ...p, address: { ...p.address, [k]: v } }));
    setErrors((p) => {
      const key = `address.${k}`;
      if (!p[key]) return p;
      const c = { ...p };
      delete c[key];
      return c;
    });
  };

  const validate = () => {
    const next = {};

    if (!form.nombre.trim()) next.nombre = 'Nombre es obligatorio.';
    if (!form.apellido.trim()) next.apellido = 'Apellido es obligatorio.';

    if (!form.username.trim()) next.username = 'Username es obligatorio.';
    else if (form.username.trim().length < 3) next.username = 'Username debe tener al menos 3 caracteres.';
    else if (!/^[a-zA-Z0-9._-]+$/.test(form.username.trim()))
      next.username = 'Username solo letras, números, punto, guión y guión bajo.';

    if (!form.email.trim()) next.email = 'Email es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = 'Ingresa un email válido.';

    if (form.telefono?.trim() && !/^\+?\d[\d\s-]{6,14}$/.test(form.telefono.trim())) {
      next.telefono = 'Teléfono inválido.';
    }

    // Dirección obligatoria
    if (!form.address.direccion.trim()) next['address.direccion'] = 'Dirección es obligatoria.';
    if (!form.address.ciudad.trim()) next['address.ciudad'] = 'Ciudad es obligatoria.';
    if (!form.address.pais.trim()) next['address.pais'] = 'País es obligatorio.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    onSave({
      username: form.username.trim(),
      email: form.email.trim(),
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      telefono: (form.telefono || '').trim(),
      image_profile: pendingImage ?? data?.image_profile ?? null, // ✅ guarda la foto nueva si existe
      address: {
        direccion: form.address.direccion.trim(),
        ciudad: form.address.ciudad.trim(),
        pais: form.address.pais.trim(),
        codigo_postal: (form.address.codigo_postal || '').trim(),
      },
    });
  };

  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        <h5 className="mb-1">Información Personal</h5>
        <p className="text-muted mb-3">Actualiza tus datos personales y de contacto</p>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              <i className="bi bi-person me-2" />
              Nombre
            </label>
            <input
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              value={form.nombre}
              onChange={setField('nombre')}
              disabled={!editMode || isSaving}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              <i className="bi bi-person me-2" />
              Apellido
            </label>
            <input
              className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
              value={form.apellido}
              onChange={setField('apellido')}
              disabled={!editMode || isSaving}
            />
            {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
          </div>

          {/* ✅ editable */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              <i className="bi bi-at me-2" />
              Username
            </label>
            <input
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              value={form.username}
              onChange={setField('username')}
              disabled={!editMode || isSaving}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          {/* ✅ editable */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              <i className="bi bi-envelope me-2" />
              Correo electrónico
            </label>
            <input
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={setField('email')}
              disabled={!editMode || isSaving}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              <i className="bi bi-shield me-2" />
              Rol
            </label>
            <input className="form-control" value={roleLabel} disabled />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              <i className="bi bi-telephone me-2" />
              Teléfono
            </label>
            <input
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              value={form.telefono}
              onChange={setField('telefono')}
              disabled={!editMode || isSaving}
              placeholder="+56 9 1234 5678"
            />
            {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
          </div>
        </div>

        <hr className="my-4" />

        <h6 className="mb-3">Dirección</h6>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Dirección</label>
            <input
              className={`form-control ${errors['address.direccion'] ? 'is-invalid' : ''}`}
              value={form.address.direccion}
              onChange={setAddr('direccion')}
              disabled={!editMode || isSaving}
            />
            {errors['address.direccion'] && (
              <div className="invalid-feedback">{errors['address.direccion']}</div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Ciudad</label>
            <input
              className={`form-control ${errors['address.ciudad'] ? 'is-invalid' : ''}`}
              value={form.address.ciudad}
              onChange={setAddr('ciudad')}
              disabled={!editMode || isSaving}
            />
            {errors['address.ciudad'] && (
              <div className="invalid-feedback">{errors['address.ciudad']}</div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">País</label>
            <input
              className={`form-control ${errors['address.pais'] ? 'is-invalid' : ''}`}
              value={form.address.pais}
              onChange={setAddr('pais')}
              disabled={!editMode || isSaving}
            />
            {errors['address.pais'] && (
              <div className="invalid-feedback">{errors['address.pais']}</div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Código Postal</label>
            <input
              className="form-control"
              value={form.address.codigo_postal}
              onChange={setAddr('codigo_postal')}
              disabled={!editMode || isSaving}
            />
          </div>
        </div>

        {editMode && (
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button className="btn btn-outline-secondary" onClick={onCancel} disabled={isSaving}>
              Cancelar
            </button>
            <button className="btn btn-dark" onClick={submit} disabled={isSaving}>
              {isSaving && <span className="spinner-border spinner-border-sm me-2" />}
              Guardar cambios
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePersonalForm;
