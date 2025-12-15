import React from "react";

const StatCard = ({ icon, label, value }) => (
  <div className="col-12 col-md-6 col-xl-3">
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body d-flex align-items-center gap-3">
        <div className="orders-stat-icon">
          <i className={`bi ${icon}`} />
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fs-4 fw-bold">{value}</div>
        </div>
      </div>
    </div>
  </div>
);

const OrdersStatsCards = ({ stats }) => {
  const s = stats || {};
  return (
    <div className="row g-3">
      <StatCard icon="bi-receipt" label="Total pedidos" value={s.total ?? 0} />
      <StatCard icon="bi-hourglass-split" label="Pendientes" value={s.pendientes ?? 0} />
      <StatCard icon="bi-credit-card" label="Pagados" value={s.pagados ?? 0} />
      <StatCard icon="bi-truck" label="Enviados" value={s.enviados ?? 0} />
    </div>
  );
};

export default OrdersStatsCards;
