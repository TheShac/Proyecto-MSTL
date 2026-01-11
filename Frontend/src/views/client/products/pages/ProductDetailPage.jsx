import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import { getProductById } from "../services/productService";

import Loading from "../components/Loading";
import ProductDetailImage from "../components/ProductDetailImage";
import ProductDetailInfo from "../components/ProductDetailInfo";
import ProductDetailActions from "../components/ProductDetailActions";
import ProductRecommendations from "../components/ProductRecommendations";

const ProductDetailPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductById(id);
      if (res?.success) setProduct(res.data);
      else setProduct(null);
    } catch (error) {
      console.error("Error cargando producto:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) return <Loading />;

  if (!product) {
    return (
      <div className="container py-5">
        <h4 className="text-muted">Producto no encontrado</h4>
        <Link to="/catalogo" className="btn btn-dark mt-3">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const isUnavailable = product.estado === "no_disponible" || product.stock <= 0;

  return (
    <>
      <div className="container py-5">
        <div className="row g-5 align-items-start">
          <div className="col-md-5">
            <ProductDetailImage product={product} isUnavailable={isUnavailable} />
          </div>

          <div className="col-md-7">
            <ProductDetailInfo product={product} isUnavailable={isUnavailable} />

            <div className="mt-4">
              <ProductDetailActions product={product} isUnavailable={isUnavailable} />
            </div>

            <div className="mt-4">
              <Link to="/catalogo" className="text-decoration-none">
                <i className="bi bi-arrow-left me-2"></i>
                Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <ProductRecommendations product={product} />
      </div>
    </>
  );
};

export default ProductDetailPage;
