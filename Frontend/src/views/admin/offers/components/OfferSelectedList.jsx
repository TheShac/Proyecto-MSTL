import React from "react";
import placeholderImg from "../../../../assets/images/error-icon.jpg";

const OfferSelectedList = ({ items, busy, onUpdate, onRemove }) => {
  if (!items?.length) {
    return (
      <div className="border rounded p-4 text-center text-muted">
        No hay ofertas aún.
      </div>
    );
  }

  return (
    <div className="list-group">
      {items.map((it) => {
        const imgSrc =
          it.imagen_url && String(it.imagen_url).trim() !== ""
            ? it.imagen_url
            : placeholderImg;

        const activo = it.activo === 1 || it.activo === true;

        return (
          <div key={it.id_oferta || it.id_producto} className="list-group-item d-flex gap-3 align-items-center">
            <img
              src={imgSrc}
              alt={it.nombre}
              width="56"
              height="56"
              className="rounded border"
              style={{ objectFit: "cover" }}
              onError={(e) => (e.target.src = placeholderImg)}
            />

            <div className="flex-grow-1">
              <div className="fw-semibold">{it.nombre}</div>
              <div className="text-muted small">
                {it.editorial || "Sin editorial"} · Stock: {it.stock ?? 0}
              </div>

              <div className="mt-1 small">
                <span className="text-muted me-2">Precio normal:</span>
                <span className="fw-semibold">${Number(it.precio).toLocaleString("es-CL")}</span>
                <span className="mx-2">•</span>
                <span className="text-muted me-2">Oferta:</span>
                <span className="fw-bold text-danger">
                  ${Number(it.precio_oferta).toLocaleString("es-CL")}
                </span>
              </div>

              <div className="mt-2 d-flex flex-wrap gap-2">
                <button
                  className={`btn btn-sm ${activo ? "btn-outline-success" : "btn-outline-secondary"}`}
                  type="button"
                  disabled={busy}
                  onClick={() => onUpdate(it.id_producto, { activo: activo ? 0 : 1 })}
                >
                  <i className={`bi ${activo ? "bi-toggle-on" : "bi-toggle-off"} me-1`} />
                  {activo ? "Activa" : "Inactiva"}
                </button>

                <button
                  className="btn btn-sm btn-outline-danger ms-auto"
                  type="button"
                  disabled={busy}
                  onClick={() => onRemove(it.id_producto)}
                >
                  <i className="bi bi-trash3 me-1" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OfferSelectedList;
