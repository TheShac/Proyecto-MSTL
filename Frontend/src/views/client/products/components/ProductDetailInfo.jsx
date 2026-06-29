import React from "react";
import { formatPrice, hasOffer, getDiscountPercent } from "../../../client/utils/formatPrice";
import StarRating from "../../reviews/components/StarRating";

const ProductDetailInfo = ({ product, isUnavailable }) => {
  const offer = hasOffer(product);
  const discountPct = getDiscountPercent(product);

  return (
    <>
      <p className="text-uppercase text-muted fw-semibold mb-1">
        {product.editorial || "Editorial"}
      </p>

      <h1 className="fw-bold mb-2">{product.nombre}</h1>

      {Number(product.rating_total) > 0 && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <StarRating value={product.rating_promedio} />
          <span className="fw-semibold">{Number(product.rating_promedio).toFixed(1)}</span>
          <a href="#resenas" className="text-muted small text-decoration-none">
            ({product.rating_total} reseña{Number(product.rating_total) !== 1 ? "s" : ""})
          </a>
        </div>
      )}

      <div className="mb-3">
        {offer ? (
          <>
            <div className="text-muted text-decoration-line-through fs-5">
              {formatPrice(product.precio)}
            </div>

            <div className="fw-bold text-danger fs-2">
              {formatPrice(product.precio_oferta)}
            </div>

            <span className="badge bg-danger mt-2">
              {discountPct ? `-${discountPct}%` : "OFERTA"}
            </span>
          </>
        ) : (
          <div className="fw-bold fs-2">{formatPrice(product.precio)}</div>
        )}
      </div>

      <h6 className="text-uppercase fw-bold mt-4">Descripción</h6>
      <p
        className="text-muted"
        style={{
          lineHeight: "1.8",
          textAlign: "justify",
          textJustify: "inter-word",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {product.descripcion || "Sin descripción disponible."}
      </p>

      {isUnavailable && (
        <div className="alert alert-danger fw-semibold mt-4">
          ESTE PRODUCTO NO SE ENCUENTRA EN STOCK.
        </div>
      )}
    </>
  );
};

export default ProductDetailInfo;