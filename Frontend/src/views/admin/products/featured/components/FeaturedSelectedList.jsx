import React, { useRef, useState } from "react";
import placeholderImg from "../../../../../assets/images/error-icon.jpg";

const FeaturedSelectedList = ({
  items,
  busy,
  onRemove,
  onToggleActive,
  onMoveUp,
  onMoveDown,
  onReorder, // ✅ drag reorder
}) => {
  const dragFromIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  if (!items.length) {
    return (
      <div className="border rounded p-4 text-center text-muted">
        No hay productos destacados aún.
      </div>
    );
  }

  const handleDragStart = (idx) => {
    dragFromIndex.current = idx;
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault(); // necesario para permitir drop
    if (dragOverIndex !== idx) setDragOverIndex(idx);
  };

  const handleDrop = async (idx) => {
    const from = dragFromIndex.current;
    dragFromIndex.current = null;
    setDragOverIndex(null);

    if (from === null || from === undefined) return;
    if (from === idx) return;
    if (busy) return;

    const newItems = [...items];
    const [moved] = newItems.splice(from, 1);
    newItems.splice(idx, 0, moved);

    onReorder?.(newItems);
  };

  const handleDragEnd = () => {
    dragFromIndex.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="list-group">
      {items.map((item, idx) => {
        const imgSrc =
          item.imagen_url && item.imagen_url.trim() !== ""
            ? item.imagen_url
            : placeholderImg;

        const pos =
          item.posicion && Number(item.posicion) > 0
            ? Number(item.posicion)
            : idx + 1;

        const isDragOver = dragOverIndex === idx;

        return (
          <div
            key={item.id_producto}
            className={`list-group-item d-flex gap-3 align-items-center ${
              isDragOver ? "border border-primary" : ""
            }`}
            draggable={!busy}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={() => handleDrop(idx)}
            onDragEnd={handleDragEnd}
            style={{ cursor: busy ? "not-allowed" : "grab" }}
          >
            <div className="text-muted" style={{ width: 22 }}>
              <i className="bi bi-grip-vertical" />
            </div>

            <img
              src={imgSrc}
              alt={item.nombre}
              width="56"
              height="56"
              className="rounded border"
              style={{ objectFit: "cover" }}
              onError={(e) => (e.target.src = placeholderImg)}
            />

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div className="fw-semibold">{item.nombre}</div>

                <span className="badge text-bg-light border">
                  Posición: {pos}
                </span>
              </div>

              <div className="text-muted small">
                {item.editorial || "Sin editorial"} · Stock: {item.stock ?? 0}
              </div>

              <div className="mt-2 d-flex flex-wrap gap-2">
                <button
                  className={`btn btn-sm ${
                    item.activo ? "btn-outline-success" : "btn-outline-secondary"
                  }`}
                  onClick={() => onToggleActive(item)}
                  type="button"
                  disabled={busy}
                >
                  <i
                    className={`bi ${
                      item.activo ? "bi-toggle-on" : "bi-toggle-off"
                    } me-1`}
                  />
                  {item.activo ? "Activo" : "Inactivo"}
                </button>

                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => onMoveUp(idx)}
                  type="button"
                  disabled={busy || idx === 0}
                >
                  <i className="bi bi-arrow-up me-1" />
                  Subir
                </button>

                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => onMoveDown(idx)}
                  type="button"
                  disabled={busy || idx === items.length - 1}
                >
                  <i className="bi bi-arrow-down me-1" />
                  Bajar
                </button>

                <button
                  className="btn btn-sm btn-outline-danger ms-auto"
                  onClick={() => onRemove(item.id_producto)}
                  type="button"
                  disabled={busy}
                >
                  <i className="bi bi-trash3 me-1" />
                  Quitar
                </button>
              </div>

              <div className="text-muted small mt-2">
                Tip: arrastra el producto para cambiar el orden.
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedSelectedList;
