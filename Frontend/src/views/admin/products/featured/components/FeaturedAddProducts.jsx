import React, { useEffect, useState } from "react";
import { searchProductsForFeatured } from "../services/featuredService";
import placeholderImg from "../../../../../assets/images/error-icon.jpg";

const DEBOUNCE_MS = 350;

const FeaturedAddProducts = ({ disabledIds, onAdd, busy }) => {
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // ✅ Debounce: buscar automáticamente al escribir
  useEffect(() => {
    const t = setTimeout(() => {
      const value = draft.trim();
      setPage(1);
      setSearch(value);
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [draft]);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await searchProductsForFeatured({ page, limit, search });
      if (res.success) {
        setProducts(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (e) {
      console.error(e);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  return (
    <div className="border rounded p-3">
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Buscar por nombre o editorial..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={busy}
        />
      </div>

      {loading ? (
        <div className="py-4 text-center text-muted">
          <div className="spinner-border" role="status" />
          <div className="small mt-2">Buscando...</div>
        </div>
      ) : (
        <>
          <div className="list-group">
            {products.map((p) => {
              const imgSrc =
                p.imagen_url && p.imagen_url.trim() !== ""
                  ? p.imagen_url
                  : placeholderImg;

              const isDisabled = disabledIds?.has(p.id_producto);

              return (
                <div
                  key={p.id_producto}
                  className="list-group-item d-flex gap-3 align-items-center"
                >
                  <img
                    src={imgSrc}
                    alt={p.nombre}
                    width="52"
                    height="52"
                    className="rounded border"
                    style={{ objectFit: "cover" }}
                    onError={(e) => (e.target.src = placeholderImg)}
                  />

                  <div className="flex-grow-1">
                    <div className="fw-semibold">{p.nombre}</div>
                    <div className="text-muted small">
                      {p.editorial || "Sin editorial"}
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    type="button"
                    disabled={isDisabled || busy}
                    onClick={() => onAdd(p)}
                  >
                    <i className="bi bi-plus-circle me-1" />
                    {isDisabled ? "Agregado" : "Agregar"}
                  </button>
                </div>
              );
            })}

            {!products.length && (
              <div className="text-center text-muted py-4">
                No se encontraron resultados.
              </div>
            )}
          </div>

          {/* ✅ paginación mini */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || busy}
              type="button"
            >
              <i className="bi bi-chevron-left" /> Anterior
            </button>

            <span className="text-muted small">
              Página {page} de {totalPages}
            </span>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || busy}
              type="button"
            >
              Siguiente <i className="bi bi-chevron-right" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedAddProducts;
