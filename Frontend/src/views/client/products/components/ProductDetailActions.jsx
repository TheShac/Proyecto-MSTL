import React from "react";
import { formatPrice } from "../../catalogo/utils/formatPrice";

const ProductDetailActions = ({ product, isUnavailable }) => {
  return (
    <div className="d-flex align-items-center justify-content-between border-top pt-4 mt-4">
      <div>
        <p className="text-uppercase text-muted mb-1">Precio</p>
        <h2 className="fw-bold">{formatPrice(product.precio)}</h2>
        <p className="text-muted small mb-0">Stock: {product.stock ?? 0}</p>
      </div>

      <button className="btn btn-dark btn-lg px-5" disabled={isUnavailable}>
        <i className="bi bi-cart me-2"></i>
        Agregar al carro
      </button>
    </div>
  );
};

export default ProductDetailActions;
