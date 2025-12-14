import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import OrdersStatsCards from "./OrdersStatsCards";
import OrdersFiltersBar from "./OrdersFiltersBar";
import OrdersTable from "./OrdersTable";
import OrderDetailsModal from "./OrderDetailsModal";

import { ordersService } from "../services/orders.service";

const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await ordersService.list();
      const list = Array.isArray(res) ? res : (res?.data || []);
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
  }, []);

  const stats = useMemo(() => {
    const base = {
      total: orders.length,
      pendiente: 0,
      procesando: 0,
      enviado: 0,
      entregado: 0,
      cancelado: 0,
    };
    for (const o of orders) {
      if (base[o.estado] !== undefined) base[o.estado] += 1;
    }
    return base;
  }, [orders]);

  const filtered = useMemo(() => {
    let list = orders;

    if (status !== "all") {
      list = list.filter((o) => o.estado === status);
    }

    const q = norm(query);
    if (!q) return list;

    return list.filter((o) => {
      const hay = norm(`${o.id} ${o.cliente?.nombre} ${o.cliente?.email}`);
      return hay.includes(q);
    });
  }, [orders, query, status]);

  const onView = (order) => {
    setSelected(order);
    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  const onChangeStatus = async (order, nextStatus) => {
    // En la UI de la imagen se permite cambiar; acá lo dejamos listo.
    try {
      await ordersService.updateStatus({ id: order.id, estado: nextStatus });
      await fetchOrders();
      Swal.fire("Éxito", "Estado actualizado (mock). Cuando tengas backend real, lo conectamos.", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo actualizar el estado.", "error");
    }
  };

  return (
    <div className="orders-page p-4">
      <div className="mb-3">
        <h2 className="mb-1">Gestión de Pedidos</h2>
        <p className="text-muted mb-0">Administra y monitorea todos los pedidos de la tienda</p>
      </div>

      <OrdersStatsCards stats={stats} />

      <div className="orders-card card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <OrdersFiltersBar
            query={query}
            onQueryChange={setQuery}
            status={status}
            onStatusChange={setStatus}
          />

          <OrdersTable
            orders={filtered}
            isLoading={isLoading}
            onView={onView}
            onChangeStatus={onChangeStatus}
          />
        </div>
      </div>

      <OrderDetailsModal show={showModal} order={selected} onClose={onCloseModal} />
    </div>
  );
};

export default AdminOrdersPage;
