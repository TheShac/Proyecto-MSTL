import React from 'react';

const ProfileSidebarCard = ({ name, roleLabel, email, image, lastLogin, editMode }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 profile-sidebar-card">
      <div className="card-body">
        <div className="d-flex flex-column align-items-center text-center">
          {image ? (
            <img src={image} alt="profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar placeholder" />
          )}

          {editMode && (
            <button className="btn btn-outline-secondary btn-sm mt-3" type="button" disabled>
              <i className="bi bi-upload me-2" />
              Cambiar foto (pendiente)
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
