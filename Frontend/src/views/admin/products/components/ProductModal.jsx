import React from "react";
import { normalizeNumberInput } from "../utils/formatters";

const ProductModal = ({
  show,
  isEditing,
  form,
  errors,
  isSaving,
  editorials,
  genres,
  onClose,
  onSubmit,
  onChange,
  onImageUpload,
}) => {
  if (!show) return null;

  const RequiredStar = () => <span className="text-danger ms-1">*</span>;

  const onNumberChange = (field) => (e) => {
    const normalized = normalizeNumberInput(e.target.value);
    onChange(field)({ target: { value: normalized } });
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow rounded-4 border-0">
          {/* ✅ Header sin bg-warning fijo */}
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? "Editar Producto" : "Nuevo Producto"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={onSubmit} noValidate>
            {/* ✅ Body sin bg-light fijo */}
            <div className="modal-body">
              <p className="small text-muted mb-3">
                Los campos con <span className="text-danger">*</span> son obligatorios.
              </p>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Nombre <RequiredStar />
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    value={form.nombre}
                    onChange={onChange("nombre")}
                  />
                  {errors.nombre && (
                    <div className="invalid-feedback">{errors.nombre}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Estado <RequiredStar />
                  </label>
                  <select
                    className={`form-select ${errors.estado ? "is-invalid" : ""}`}
                    value={form.estado}
                    onChange={onChange("estado")}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="no_disponible">No disponible</option>
                  </select>
                  {errors.estado && (
                    <div className="invalid-feedback">{errors.estado}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={form.descripcion}
                    onChange={onChange("descripcion")}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Precio (CLP) <RequiredStar />
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                    value={form.precio}
                    onChange={onNumberChange("precio")}
                    placeholder="Ej: 12990"
                  />
                  {errors.precio && (
                    <div className="invalid-feedback">{errors.precio}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Stock <RequiredStar />
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                    value={form.stock}
                    onChange={onNumberChange("stock")}
                    placeholder="Ej: 15"
                  />
                  {errors.stock && (
                    <div className="invalid-feedback">{errors.stock}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Editorial <RequiredStar />
                  </label>
                  <select
                    className={`form-select ${errors.id_editorial ? "is-invalid" : ""}`}
                    value={form.id_editorial}
                    onChange={onChange("id_editorial")}
                  >
                    <option value="" disabled>
                      Selecciona una editorial
                    </option>
                    {editorials.map((ed) => (
                      <option key={ed.id_editorial} value={ed.id_editorial}>
                        {ed.nombre_editorial}
                      </option>
                    ))}
                  </select>
                  {errors.id_editorial && (
                    <div className="invalid-feedback">{errors.id_editorial}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Género <RequiredStar />
                  </label>
                  <select
                    className={`form-select ${errors.id_genero ? "is-invalid" : ""}`}
                    value={form.id_genero}
                    onChange={onChange("id_genero")}
                  >
                    <option value="" disabled>
                      Selecciona un género
                    </option>
                    {genres.map((g) => (
                      <option key={g.id_genero} value={g.id_genero}>
                        {g.nombre_genero}
                      </option>
                    ))}
                  </select>
                  {errors.id_genero && (
                    <div className="invalid-feedback">{errors.id_genero}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Imagen</label>
                  <input type="file" accept="image/*" onChange={onImageUpload} />
                  {form.imagen_url && (
                    <div className="mt-2">
                      <img
                        src={form.imagen_url}
                        alt="Preview"
                        style={{ maxWidth: 150, borderRadius: 8 }}
                      />
                    </div>
                  )}
                </div>
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
                {isEditing ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
