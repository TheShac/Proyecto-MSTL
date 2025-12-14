import React from "react";
import { formatDateDMY } from "../utils/date";

const typePill = (tipo) => {
  if (tipo === "entrada") return { cls: "pill pill-dark", label: "Entrada", icon: "+" };
  if (tipo === "salida") return { cls: "pill pill-light", label: "Salida", icon: "−" };
  return { cls: "pill pill-outline", label: "Ajuste", icon: "" };
};

const formatDelta = (m) => {
  let delta = m?.delta;
  if (delta == null) {
    const qty = Number(m?.cantidad ?? 0);
    if (m?.tipo === "entrada") delta = qty;
    else if (m?.tipo === "salida") delta = -qty;
    else if (m?.tipo === "ajuste") {
      const a = Number(m?.stock_anterior ?? 0);
      const n = Number(m?.stock_nuevo ?? 0);
      delta = n - a;
    } else delta = 0;
  }

  const n = Number(delta);
  if (!Number.isFinite(n)) return { text: "—", cls: "text-muted" };

  if (n > 0) return { text: `+${n}`, cls: "mov-delta mov-delta-pos" };
  if (n < 0) return { text: `${n}`, cls: "mov-delta mov-delta-neg" };
  return { text: "0", cls: "mov-delta mov-delta-zero" };
};

const MovementsTable = ({ movements, isLoading }) => {
  return (
    <div className="table-responsive inventory-table-wrap">
      <table className="table table-hover align-middle text-start inventory-mov-table">
        <thead className="table-warning">
          <tr>
            <th style={{ minWidth: 140 }}>Fecha</th>
            <th style={{ minWidth: 260 }}>Producto</th>
            <th style={{ minWidth: 160 }}>Tipo</th>
            <th style={{ minWidth: 140 }}>Cantidad</th>
            <th style={{ minWidth: 320 }}>Motivo</th>
            <th style={{ minWidth: 160 }}>Usuario</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-5 text-center">
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="spinner-border text-warning" role="status" />
                  <div className="text-muted">Cargando movimientos...</div>
                </div>
              </td>
            </tr>
          ) : movements.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-muted py-4 text-center">
                No hay movimientos para mostrar.
              </td>
            </tr>
          ) : (
            movements.map((m) => {
              const pill = typePill(m.tipo);
              const d = formatDelta(m);

              return (
                <tr key={m.id_movimiento}>
                  <td>{formatDateDMY(m.fecha_movimiento)}</td>

                  <td className="fw-semibold">{m.producto || "—"}</td>

                  <td>
                    <span className={pill.cls}>
                      {pill.icon && <span className="pill-icon">{pill.icon}</span>}
                      {pill.label}
                    </span>
                  </td>

                  <td>
                    <span className={d.cls}>{d.text}</span>
                  </td>

                  <td className="mov-motivo">{m.motivo || "—"}</td>

                  <td>{m.usuario || "Por implementar"}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MovementsTable;
