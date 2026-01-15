import React from "react";
import { formatPrice, hasOffer } from "../../../client/utils/formatPrice";

const ProductDetailActions = ({ product, isUnavailable }) => {
  const offer = hasOffer(product);

  const priceToShow = offer ? product.precio_oferta : product.precio;
  const label = offer ? "Precio oferta" : "Precio";

  return (
    <div className="d-flex align-items-center justify-content-between border-top pt-4 mt-4">
      <div>
        <p className="text-uppercase text-muted mb-1">{label}</p>
        <h2 className={`fw-bold mb-0 ${offer ? "text-danger" : ""}`}>
          {formatPrice(priceToShow)}
        </h2>
      </div>

      <button className="btn btn-dark btn-lg px-5" disabled={isUnavailable}>
        <i className="bi bi-cart me-2"></i>
        Agregar al carro
      </button>
    </div>
  );
};

export default ProductDetailActions;
