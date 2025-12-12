import React from 'react';

const InventorySearchBar = ({ value, onChange }) => {
  return (
    <div className="inventory-search mb-3">
      <div className="input-group">
        <span className="input-group-text bg-white">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar productos..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default InventorySearchBar;
