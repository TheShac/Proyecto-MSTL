import React, { useState } from "react";
import Swal from "sweetalert2";
import { formatPrice, hasOffer } from "../../../client/utils/formatPrice";
import { useCart } from "../../../../stores/CartContext";

const ProductDetailActions = ({ product, isUnavailable }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const offer = hasOffer(product);

  const priceToShow = offer ? product.precio_oferta : product.precio;
  const label = offer ? "Precio oferta" : "Precio";

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

  return (
    <div className="d-flex align-items-center justify-content-between border-top pt-4 mt-4">
      <div>
        <p className="text-uppercase text-muted mb-1">{label}</p>
        <h2 className={`fw-bold mb-0 ${offer ? "text-danger" : ""}`}>
          {formatPrice(priceToShow)}
        </h2>
      </div>

      <button
        className="btn btn-dark btn-lg px-5"
        disabled={isUnavailable || adding}
        onClick={handleAdd}
      >
        <i className="bi bi-cart me-2"></i>
        {adding ? "Agregando..." : "Agregar al carro"}
      </button>
    </div>
  );
};

export default ProductDetailActions;
