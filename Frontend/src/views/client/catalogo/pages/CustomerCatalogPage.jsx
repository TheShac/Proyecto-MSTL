import React, { useEffect, useState } from "react";
import CatalogFilters from "../components/CatalogFilters";
import CatalogGrid from "../components/CatalogGrid";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import { getCatalogProducts, getEditorials } from "../services/catalogService";

const CustomerCatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [editorials, setEditorials] = useState([]);

  const [loading, setLoading] = useState(false);

  // ✅ draftFilters = lo que escribe el usuario
  const [draftFilters, setDraftFilters] = useState({
    search: "",
    editorial: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  // ✅ filtros aplicados
  const [filters, setFilters] = useState({
    search: "",
    editorial: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  const [page, setPage] = useState(1);
  const limit = 12;

  const [totalPages, setTotalPages] = useState(1);

  // ✅ cargar editoriales al cargar la página
  useEffect(() => {
    const loadEditorials = async () => {
      try {
        const res = await getEditorials();

        // res = {success:true, data:[...]}
        if (res.success) {
          setEditorials(res.data);
        }
      } catch (error) {
        console.error("Error cargando editoriales:", error);
      }
    };

    loadEditorials();
  }, []);

  // ✅ cargar productos cuando cambie page o filters
  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getCatalogProducts({
        page,
        limit,
        ...filters,
      });

      if (res.success) {
        setProducts(res.data);
        setTotalPages(res.totalPages);
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

      {/* ✅ filtros */}
      <CatalogFilters
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        editorials={editorials}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* ✅ loading */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* ✅ grid */}
          <CatalogGrid products={products} />

          {/* ✅ paginación */}
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}
    </div>
  );
};

export default CustomerCatalogPage;
