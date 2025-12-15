import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { ordersCustomerService } from "../services/orders.customer.service";

const formatCLP = (n) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(
    Number(n || 0)
  );

const CartPage = ({ onGoCheckout }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + Number(it.cantidad || 0) * Number(it.precio_unitario || 0), 0);
  }, [items]);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await ordersCustomerService.getCart();
      const data = res?.data;
      if (!data) {
        setOrder(null);
        setItems([]);
      } else {
        setOrder(data.order);
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo cargar el carrito.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeQty = async (id_producto, nextQty) => {
    if (nextQty < 0) return;
    try {
      await ordersCustomerService.upsertItem({ id_producto, cantidad: nextQty });
      await load();
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "No se pudo actualizar.";
      Swal.fire("Error", msg, "error");
    }
  };

  const remove = async (id_producto) => {
    try {
      await ordersCustomerService.removeItem(id_producto);
      await load();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo eliminar el producto.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body py-5 text-center">
            <div className="spinner-border text-warning" role="status" />
            <div className="text-muted mt-2">Cargando carrito...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!order || items.length === 0) {
    return (
      <div className="p-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body py-5 text-center">
            <h5 className="mb-2">Tu carrito está vacío</h5>
            <p className="text-muted mb-0">Agrega productos para continuar.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <h2 className="mb-0">Carrito</h2>
          <p className="text-muted mb-0">Pedido: <b>{order.uuid_pedido}</b></p>
        </div>

        <button className="btn btn-warning" onClick={() => onGoCheckout?.()}>
          Ir a pagar
        </button>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle text-center">
              <thead className="table-warning">
                <tr>
                  <th className="text-start">Producto</th>
                  <th>Precio</th>
                  <th style={{ width: 170 }}>Cantidad</th>
                  <th>Total</th>
                  <th style={{ width: 120 }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const totalItem = Number(it.cantidad || 0) * Number(it.precio_unitario || 0);
                  return (
                    <tr key={it.id_producto}>
                      <td className="text-start">
                        <div className="fw-semibold">{it.nombre}</div>
                        <div className="text-muted small">Stock: {it.stock ?? "—"}</div>
                      </td>
                      <td>{formatCLP(it.precio_unitario)}</td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => changeQty(it.id_producto, Number(it.cantidad || 0) - 1)}
                          >
                            −
                          </button>
                          <span className="fw-semibold">{it.cantidad}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => changeQty(it.id_producto, Number(it.cantidad || 0) + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="fw-semibold">{formatCLP(totalItem)}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => remove(it.id_producto)}>
                          Quitar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <hr />

          <div className="d-flex justify-content-end">
            <div className="text-end">
              <div className="text-muted">Subtotal</div>
              <div className="fs-5 fw-bold">{formatCLP(subtotal)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
