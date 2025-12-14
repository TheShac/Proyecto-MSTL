import React, { useRef } from 'react';

const ProfileSidebarCard = ({
  name,
  roleLabel,
  email,
  image,
  lastLogin,
  editMode,
  isSaving,
  onPickImage,
}) => {
  const fileRef = useRef(null);

  const openFilePicker = () => {
    if (isSaving) return;
    fileRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones simples
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result; // data:image/...;base64,...
      onPickImage?.(base64);
    };
    reader.readAsDataURL(file);

    // permite volver a elegir el mismo archivo
    e.target.value = '';
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 profile-sidebar-card">
      <div className="card-body">
        <div className="d-flex flex-column align-items-center text-center">
          {image ? (
            <img src={image} alt="profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar placeholder" />
          )}

          {/* input oculto */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onFileChange}
          />

          {editMode && (
            <button
              className="btn btn-outline-secondary btn-sm mt-3"
              type="button"
              onClick={openFilePicker}
              disabled={isSaving}
            >
              <i className="bi bi-upload me-2" />
              Cambiar foto
            </button>
          )}

          <h4 className="mt-3 mb-1">{name}</h4>

          <span className="badge rounded-pill text-bg-light profile-role">
            <i className="bi bi-shield-check me-1" />
            {roleLabel}
          </span>

          <hr className="w-100 my-3" />

          <div className="w-100 text-start profile-meta">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-envelope" />
              <span>{email}</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-clock" />
              <span>{lastLogin ? new Date(lastLogin).toLocaleString() : '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebarCard;
