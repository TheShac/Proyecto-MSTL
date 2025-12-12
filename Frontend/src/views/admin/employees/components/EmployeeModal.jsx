import React from "react";

const EmployeeModal = ({
  show,
  isEditing,
  form,
  roles,
  isSaving,
  onClose,
  onSubmit,
  onChange,
}) => {
  if (!show) return null;

  const RequiredStar = () => <span className="text-danger ms-1">*</span>;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow rounded-4 border-0">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">
              {isEditing ? "Editar Empleado" : "Agregar Empleado"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <p className="small text-muted mb-3">
                Los campos con <span className="text-danger">*</span> son obligatorios.
              </p>

              <div className="mb-3">
                <label className="form-label">
                  Nombre <RequiredStar />
                </label>
                <input
                  className="form-control"
                  required
                  value={form.nombre}
                  onChange={onChange("nombre")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Apellido <RequiredStar />
                </label>
                <input
                  className="form-control"
                  required
                  value={form.apellido}
                  onChange={onChange("apellido")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Usuario <RequiredStar />
                </label>
                <input
                  className="form-control"
                  required
                  value={form.username}
                  onChange={onChange("username")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Email <RequiredStar />
                </label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={form.email}
                  onChange={onChange("email")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  className="form-control"
                  value={form.telefono}
                  onChange={onChange("telefono")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Rol <RequiredStar />
                </label>
                <select
                  className="form-select"
                  required
                  value={form.id_role}
                  onChange={onChange("id_role")}
                >
                  <option value="" disabled>
                    Selecciona un rol
                  </option>
                  {roles.map((r) => (
                    <option key={r.id_role} value={r.id_role}>
                      {r.nombre_rol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancelar
              </button>

              <button type="submit" className="btn btn-warning" disabled={isSaving}>
                {isSaving && <span className="spinner-border spinner-border-sm me-2" />}
                {isEditing ? "Guardar Cambios" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
