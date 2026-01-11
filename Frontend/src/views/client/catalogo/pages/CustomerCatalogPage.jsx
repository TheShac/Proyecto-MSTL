import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import CatalogFilters from "../components/CatalogFilters";
import CatalogGrid from "../components/CatalogGrid";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";

import { getCatalogProducts, getEditorials, getGenres } from "../services/catalogService";

const CustomerCatalogPage = () => {
  const location = useLocation();

  // ✅ lee query params del link (ej: /catalogo?editorial=Ivrea%20Argentina&sort=newest)
  const initialFromUrl = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return {
      search: sp.get("search") || "",
      editorial: sp.get("editorial") || "",
      genre: sp.get("genre") || "",
      minPrice: sp.get("minPrice") || "",
      maxPrice: sp.get("maxPrice") || "",
      sort: sp.get("sort") || "newest",
    };
  }, [location.search]);

  const [products, setProducts] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [genres, setGenres] = useState([]);

  const [loading, setLoading] = useState(false);

  // ✅ draftFilters = lo que escribe el usuario
  const [draftFilters, setDraftFilters] = useState(initialFromUrl);

  // ✅ filtros aplicados
  const [filters, setFilters] = useState(initialFromUrl);

  const [page, setPage] = useState(1);
  const limit = 12;

  const [totalPages, setTotalPages] = useState(1);

  // ✅ cuando entras desde un link con query params (Ver más productos →)
  // dejamos el formulario (draft) con esos valores.
  // Si quieres que NO se apliquen automáticamente, comenta la línea setFilters(initialFromUrl)
  useEffect(() => {
    setDraftFilters(initialFromUrl);

    // ✅ opción A (recomendado para UX): que sí se apliquen al venir desde el link
    setFilters(initialFromUrl);

    // ✅ opción B (tu requisito estricto): que NO se apliquen hasta "Aplicar"
    // -> comenta setFilters(...) de arriba y deja solo draft

    setPage(1);
  }, [initialFromUrl]);

  // ✅ cargar filtros (editoriales/géneros) al cargar la página
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [edRes, genRes] = await Promise.all([getEditorials(), getGenres()]);

        if (edRes?.success) setEditorials(edRes.data || []);
        if (genRes?.success) setGenres(genRes.data || []);
      } catch (error) {
        console.error("Error cargando filtros:", error);
      }
    };

    loadFilters();
  }, []);

  // ✅ cargar productos cuando cambie page o filters
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getCatalogProducts({
        page,
        limit,
        ...filters,
      });

      if (res?.success) {
        setProducts(res.data || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (error) {
      console.error("Error cargando catálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ aplicar filtros solo con botón
  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setPage(1);
  };

  // ✅ limpiar filtros
  const handleClearFilters = () => {
    const clean = {
      search: "",
      editorial: "",
      genre: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    };
    setDraftFilters(clean);
    setFilters(clean);
    setPage(1);
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Catálogo</h2>

      <CatalogFilters
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        editorials={editorials}
        genres={genres}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {loading ? (
        <Loading />
      ) : (
        <>
          <CatalogGrid products={products} />
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}
    </div>
  );
};

export default CustomerCatalogPage;
