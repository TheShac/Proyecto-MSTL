import React from "react";
import { formatDateCL } from "../utils/formatters";

const typeLabel = (t) => {
  if (t === "entrada") return "Entrada";
  if (t === "salida") return "Salida";
  if (t === "ajuste") return "Ajuste";
  return t || "—";
};

const deltaBadge = (delta) => {
  const d = Number(delta ?? 0);

  if (d === 0) return { cls: "badge bg-secondary", text: "0" };
  if (d > 0) return { cls: "badge bg-success", text: `+${d}` };
  return { cls: "badge bg-danger", text: `${d}` };
};

const InventoryMovementsTable = ({ movements, isLoading }) => {
  return (
    <div className="table-responsive inventory-table-wrap">
      <table className="table table-hover align-middle text-center inventory-table">
        <thead className="table-warning">
          <tr>
            <th style={{ width: 170 }}>Fecha</th>
            <th className="text-start">Producto</th>
            <th style={{ width: 120 }}>Tipo</th>
            <th style={{ width: 120 }}>Cantidad</th>
            <th className="text-start">Motivo</th>
            <th style={{ width: 180 }}>Usuario</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-5">
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="spinner-border text-warning" role="status" />
                  <div className="text-muted">Cargando movimientos...</div>
                </div>
              </td>
            </tr>
          ) : movements.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-muted py-4">
                No hay movimientos registrados.
              </td>
            </tr>
          ) : (
            movements.map((m) => {
              const fecha = formatDateCL(m.fecha_movimiento);
              const badge = deltaBadge(m.delta);

              return (
                <tr key={m.id_movimiento}>
                  <td>{fecha}</td>
                  <td className="text-start fw-semibold">{m.producto || "—"}</td>
                  <td>
                    <span className="badge bg-dark">{typeLabel(m.tipo)}</span>
                  </td>
                  <td>
                    <span className={badge.cls}>{badge.text}</span>
                  </td>
                  <td className="text-start">
                    <div title={m.motivo || ""} style={{ maxWidth: 520, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {m.motivo || "—"}
                    </div>
                  </td>
                  <td>{m.usuario ? m.usuario : <span className="text-muted">Por implementar</span>}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryMovementsTable;
