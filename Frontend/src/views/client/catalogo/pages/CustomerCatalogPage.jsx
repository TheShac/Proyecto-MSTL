import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import CatalogFilters from "../components/CatalogFilters";
import CatalogGrid from "../components/CatalogGrid";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";

import { getCatalogProducts, getEditorials, getGenres } from "../services/catalogService";

const CustomerCatalogPage = () => {
  const location = useLocation();

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

  const [draftFilters, setDraftFilters] = useState({
    search: "",
    editorial: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    onlyOffers: false,
  });

  const [filters, setFilters] = useState({
    search: "",
    editorial: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    onlyOffers: false,
  });

  const [page, setPage] = useState(1);
  const limit = 12;

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setDraftFilters(initialFromUrl);

    setFilters(initialFromUrl);

    setPage(1);
  }, [initialFromUrl]);

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

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    const clean = {
      search: "",
      editorial: "",
      genre: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      onlyOffers: false,
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
