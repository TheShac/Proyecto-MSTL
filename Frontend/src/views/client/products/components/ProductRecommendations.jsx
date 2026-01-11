import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCarousel from "./ProductCarousel";
import { getCatalogProducts } from "../services/productService";

const ProductRecommendations = ({ product }) => {
  const [byEditorial, setByEditorial] = useState([]);
  const [byGenre, setByGenre] = useState([]);
  const [loading, setLoading] = useState(true);

  const editorialName = product?.editorial || "";
  const genreName = product?.genero || "";

  const editorialQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (editorialName) params.set("editorial", editorialName);
    params.set("sort", "newest");
    return params.toString();
  }, [editorialName]);

  const genreQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (genreName) params.set("genre", genreName);
    params.set("sort", "newest");
    return params.toString();
  }, [genreName]);

  useEffect(() => {
    const load = async () => {
      if (!product) return;
      setLoading(true);

      try {
        const [resEditorial, resGenre] = await Promise.all([
          editorialName
            ? getCatalogProducts({ page: 1, limit: 12, editorial: editorialName, sort: "newest" })
            : Promise.resolve({ data: [] }),
          genreName
            ? getCatalogProducts({ page: 1, limit: 12, genre: genreName, sort: "newest" })
            : Promise.resolve({ data: [] }),
        ]);

        const filterSelf = (arr) =>
          (arr || []).filter((p) => p.id_producto !== product.id_producto);

        setByEditorial(filterSelf(resEditorial?.data || []));
        setByGenre(filterSelf(resGenre?.data || []));
      } catch (err) {
        console.error("Error cargando recomendados:", err);
        setByEditorial([]);
        setByGenre([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [product?.id_producto, editorialName, genreName]);

  if (!product) return null;

  return (
    <div className="container pb-5">
      {/* ====== BLOQUE: Misma editorial ====== */}
      <section className="mt-5">
        <div className="text-center mb-4">
          <div className="text-uppercase fw-bold" style={{ letterSpacing: "1px", color: "#1e3a8a" }}>
            Puede que te interesen otros productos de
          </div>

          <div className="display-6 fw-bold mt-2">
            {editorialName || "Esta editorial"}
          </div>

          {editorialName && (
            <Link
              to={`/catalogo?${editorialQuery}`}
              className="text-decoration-none d-inline-flex align-items-center gap-2 mt-3"
              style={{ fontSize: "1.05rem" }}
            >
              <span className="text-secondary">Ver más productos</span>
              <i className="bi bi-arrow-right text-secondary"></i>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-muted text-center">Cargando recomendaciones...</div>
        ) : (
          <ProductCarousel
            title={null}
            products={byEditorial}
            emptyText="No encontramos productos de la misma editorial."
          />
        )}
      </section>

      {/* ====== BLOQUE: Mismo género ====== */}
      <section className="mt-5">
        <div className="text-center mb-4">
          <div className="text-uppercase fw-bold" style={{ letterSpacing: "1px", color: "#1e3a8a" }}>
            También te podrían gustar productos de
          </div>

          <div className="display-6 fw-bold mt-2">
            {genreName || "Este género"}
          </div>

          {genreName && (
            <Link
              to={`/catalogo?${genreQuery}`}
              className="text-decoration-none d-inline-flex align-items-center gap-2 mt-3"
              style={{ fontSize: "1.05rem" }}
            >
              <span className="text-secondary">Ver más productos</span>
              <i className="bi bi-arrow-right text-secondary"></i>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-muted text-center">Cargando recomendaciones...</div>
        ) : (
          <ProductCarousel
            title={null}
            products={byGenre}
            emptyText="No encontramos productos del mismo género."
          />
        )}
      </section>
    </div>
  );
};

export default ProductRecommendations;
