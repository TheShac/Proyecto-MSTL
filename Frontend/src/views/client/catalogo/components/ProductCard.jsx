import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { formatPrice, hasOffer, getDiscountPercent } from "../../../client/utils/formatPrice";
import { useCart } from "../../../../stores/CartContext";
import { useWishlist } from "../../../../stores/WishlistContext";
import StarRating from "../../reviews/components/StarRating";
import placeholderImg from "../../../../assets/images/error-icon.jpg";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { has, toggle, isCustomer } = useWishlist();
  const [adding, setAdding] = useState(false);

  const fav = has(product.id_producto);

  const handleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCustomer) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Inicia sesión para usar favoritos",
        showConfirmButton: false,
        timer: 1800,
      });
      return;
    }
    try {
      await toggle(product.id_producto);
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo actualizar favoritos.", "error");
    }
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(product);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Producto agregado al carrito",
        showConfirmButton: false,
        timer: 1600,
      });
    } catch (e) {
      Swal.fire("Error", e.message || "No se pudo agregar al carrito.", "error");
    } finally {
      setAdding(false);
    }
  };

  const unavailableByState =
    String(product?.estado || "").toLowerCase() === "no_disponible";
  const unavailableByStock = Number(product?.stock) <= 0;
  const isUnavailable = unavailableByState || unavailableByStock;

  const imageSrc =
    product?.imagen_url && String(product.imagen_url).trim() !== ""
      ? product.imagen_url
      : placeholderImg;

  const offer = hasOffer(product);
  const discountPct = getDiscountPercent(product);

  return (
    <div className="card h-100 shadow-sm border-0 position-relative">
      {/* Badge descuento */}
      {offer && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-2" style={{ zIndex: 2 }}>
          {discountPct ? `-${discountPct}%` : "OFERTA"}
        </span>
      )}

      {/* Botón favorito */}
      <button
        type="button"
        className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
        onClick={handleFav}
        style={{ zIndex: 2, width: 36, height: 36 }}
        aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <i className={`bi ${fav ? "bi-heart-fill text-danger" : "bi-heart"}`} />
      </button>

      {/* Imagen clickeable */}
      <Link to={`/catalogo/${product.id_producto}`} className="text-decoration-none">
        <img
          src={imageSrc}
          className="card-img-top"
          alt={product.nombre}
          style={{ height: "300px", objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = placeholderImg;
          }}
        />
      </Link>

      {/* Overlay NO DISPONIBLE */}
      {isUnavailable && (
        <div
          className="position-absolute w-100 text-center fw-bold text-white"
          style={{
            top: "45%",
            left: 0,
            background: "rgba(0,0,0,0.6)",
            padding: "10px",
          }}
        >
          NO DISPONIBLE
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <p className="text-muted small mb-1">{product.editorial}</p>
        <h6 className="fw-semibold text-truncate">{product.nombre}</h6>

        {Number(product.rating_total) > 0 && (
          <div className="d-flex align-items-center gap-1">
            <StarRating value={product.rating_promedio} size="0.8rem" />
            <span className="text-muted small">({product.rating_total})</span>
          </div>
        )}

        {offer ? (
          <div className="mt-2">
            <div className="text-muted text-decoration-line-through small">
              {formatPrice(product.precio)}
            </div>
            <div className="fw-bold text-danger fs-5">
              {formatPrice(product.precio_oferta)}
            </div>
          </div>
        ) : (
          <p className="fw-bold mt-2">{formatPrice(product.precio)}</p>
        )}

        <div className="d-flex gap-2 mt-auto pt-3">
          <Link
            to={`/catalogo/${product.id_producto}`}
            className="btn btn-danger w-50"
          >
            Ver detalles
          </Link>

          <button
            className="btn btn-dark w-50"
            disabled={isUnavailable || adding}
            onClick={handleAdd}
          >
            {adding ? "..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;