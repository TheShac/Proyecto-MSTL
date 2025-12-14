import React from "react";

const OrdersStatsCards = ({ stats }) => {
  return (
    <div className="orders-stats mb-4">
      <div className="stat-card">
        <p className="stat-title">Total</p>
        <div className="stat-value">{stats.total}</div>
      </div>

      <div className="stat-card">
        <p className="stat-title" style={{ color: "#b58100" }}>Pendientes</p>
        <div className="stat-value">{stats.pendiente}</div>
      </div>

      <div className="stat-card">
        <p className="stat-title" style={{ color: "#0a58ca" }}>Procesando</p>
        <div className="stat-value">{stats.procesando}</div>
      </div>

      <div className="stat-card">
        <p className="stat-title" style={{ color: "#6f42c1" }}>Enviados</p>
        <div className="stat-value">{stats.enviado}</div>
      </div>

      <div className="stat-card">
        <p className="stat-title" style={{ color: "#0f5132" }}>Entregados</p>
        <div className="stat-value">{stats.entregado}</div>
      </div>

      <div className="stat-card">
        <p className="stat-title" style={{ color: "#842029" }}>Cancelados</p>
        <div className="stat-value">{stats.cancelado}</div>
      </div>
    </div>
  );
};

export default OrdersStatsCards;
