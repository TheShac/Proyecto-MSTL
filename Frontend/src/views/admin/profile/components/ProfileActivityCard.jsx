import React from 'react';

const ProfileActivityCard = ({ productsCreated, lastLogin }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        <h5 className="mb-3">Actividad</h5>

        <div className="d-flex justify-content-between py-2 border-bottom">
          <span className="text-muted">Productos creados</span>
          <span className="fw-semibold">{productsCreated}</span>
        </div>

        <div className="d-flex justify-content-between py-2">
          <span className="text-muted">Última conexión</span>
          <span className="fw-semibold">{lastLogin ? 'Hoy' : '—'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileActivityCard;
