import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../stores/CartContext";
import { formatPrice } from "../views/client/utils/formatPrice";
import placeholderImg from "../assets/images/error-icon.jpg";
import "./Styles/CartDrawer.css";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { isOpen, closeCart, items, count, subtotal, setQty, removeItem } = useCart();

  // Bloquea el scroll del body mientras el drawer está abierto.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const goCheckout = () => {
    closeCart();
    navigate("/finalizar-compra");
  };

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isOpen ? "is-open" : ""}`}
        onClick={closeCart}
      />

      <aside className={`cart-drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        {/* Header */}
        <div className="cart-drawer__header">
          <div className="d-flex align-items-center gap-2">
            <span className="cart-drawer__badge">
              <i className="bi bi-cart3" />
              {count > 0 && <span className="cart-drawer__count">{count}</span>}
            </span>
            <h5 className="m-0 fw-bold">Su carrito</h5>
          </div>
          <button className="btn btn-sm btn-close-custom" onClick={closeCart} aria-label="Cerrar">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-cart-x fs-1 d-block mb-2" />
              Tu carrito está vacío.
            </div>
          ) : (
            items.map((it) => {
              const img =
                it.imagen_url && String(it.imagen_url).trim() !== ""
                  ? it.imagen_url
                  : placeholderImg;
              const lineTotal = Number(it.cantidad || 0) * Number(it.precio_unitario || 0);

              return (
                <div className="cart-item" key={it.id_producto}>
                  <img
                    src={img}
                    alt={it.nombre}
                    className="cart-item__img"
                    onError={(e) => (e.currentTarget.src = placeholderImg)}
                  />

                  <div className="cart-item__info">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <span className="cart-item__name">{it.nombre}</span>
                      <button
                        className="cart-item__remove"
                        onClick={() => removeItem(it.id_producto)}
                        aria-label="Quitar"
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </div>

                    <div className="text-muted small">Precio: {formatPrice(it.precio_unitario)}</div>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="cart-qty">
                        <button
                          onClick={() => setQty(it.id_producto, Number(it.cantidad) - 1)}
                          disabled={Number(it.cantidad) <= 1}
                        >
                          −
                        </button>
                        <span>{it.cantidad}</span>
                        <button onClick={() => setQty(it.id_producto, Number(it.cantidad) + 1)}>
                          +
                        </button>
                      </div>
                      <span className="fw-bold">{formatPrice(lineTotal)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="cart-drawer__footer">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-bold fs-5">Total</span>
            <span className="fw-bold fs-5">{formatPrice(subtotal)}</span>
          </div>
          <p className="text-muted small mb-3">
            El costo de envío es calculado al finalizar la compra.
          </p>

          <button className="btn btn-outline-secondary w-100 mb-2" onClick={closeCart}>
            Seguir comprando
          </button>
          <button
            className="btn btn-dark w-100"
            onClick={goCheckout}
            disabled={items.length === 0}
          >
            Finalizar compra
          </button>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
