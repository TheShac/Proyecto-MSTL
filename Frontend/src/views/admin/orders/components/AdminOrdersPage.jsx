import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import OrdersStatsCards from "./OrdersStatsCards";
import OrdersFiltersBar from "./OrdersFiltersBar";
import OrdersTable from "./OrdersTable";
import OrderDetailsModal from "./OrderDetailsModal";

import { ordersService } from "../services/orders.service";

const normalizeText = (s) =>
  (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const AdminOrdersPage = () => {
  const token = useMemo(
    () => localStorage.getItem("accessToken") || localStorage.getItem("token") || "",
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const [showDetails, setShowDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selected, setSelected] = useState(null); // { order, items, address }

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await ordersService.list(token);
      const list = Array.isArray(res?.data) ? res.data : [];
      setOrders(list);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudieron cargar los pedidos.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pendientes = orders.filter((o) => o.estado === "pendiente").length;
    const pagados = orders.filter((o) => o.estado === "pagado").length;
    const enviados = orders.filter((o) => o.estado === "enviado").length;
    const entregados = orders.filter((o) => o.estado === "entregado").length;

    return { total, pendientes, pagados, enviados, entregados };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = normalizeText(query);
    return orders.filter((o) => {
      if (status !== "all" && o.estado !== status) return false;

      if (!q) return true;

      const hay = normalizeText(
        `${o.uuid_pedido} ${o.nombre_pedido} ${o.apellido_pedido} ${o.email_pedido} ${o.estado}`
      );
      return hay.includes(q);
    });
  }, [orders, status, query]);

  const openDetails = async (uuid_pedido) => {
    setDetailsLoading(true);
    setShowDetails(true);
    try {
      const res = await ordersService.getById(uuid_pedido, token);
      setSelected(res?.data || null);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo cargar el detalle del pedido.", "error");
      setShowDetails(false);
      setSelected(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    if (detailsLoading) return;
    setShowDetails(false);
    setSelected(null);
  };

  const changeStatus = async (uuid_pedido, estado) => {
    try {
      await ordersService.updateStatus(uuid_pedido, estado, token);
      Swal.fire("Éxito", "Estado actualizado.", "success");
      await fetchOrders();

      // si el modal está abierto y corresponde al mismo pedido, refrescamos detalle
      if (selected?.order?.uuid_pedido === uuid_pedido) {
        const res = await ordersService.getById(uuid_pedido, token);
        setSelected(res?.data || null);
      }
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "No se pudo actualizar el estado.";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div className="orders-page p-4">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
        <div>
          <h2 className="mb-1">Gestión de Pedidos</h2>
          <p className="text-muted mb-0">Listado y administración de pedidos</p>
        </div>
      </div>

      <OrdersStatsCards stats={stats} />

      <div className="card shadow-sm border-0 rounded-4 mt-4">
        <div className="card-body">
          <OrdersFiltersBar status={status} onStatus={setStatus} query={query} onQuery={setQuery} />

          <OrdersTable
            orders={filteredOrders}
            isLoading={isLoading}
            onView={(o) => openDetails(o.uuid_pedido)}
            onChangeStatus={(o, nextStatus) => changeStatus(o.uuid_pedido, nextStatus)}
          />
        </div>
      </div>

      <OrderDetailsModal
        show={showDetails}
        loading={detailsLoading}
        data={selected} // { order, items, address }
        onClose={closeDetails}
      />
    </div>
  );
};

export default AdminOrdersPage;
