import React from 'react';

const InventoryTabs = ({ activeTab, onChange }) => {
  return (
    <div className="inventory-tabs mb-3">
      <div className="btn-group" role="group" aria-label="Inventory tabs">
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'inventory' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => onChange('inventory')}
        >
          Inventario
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'movements' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => onChange('movements')}
        >
          Movimientos
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'alerts' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => onChange('alerts')}
        >
          Alertas
        </button>
      </div>
    </div>
  );
};

export default InventoryTabs;
