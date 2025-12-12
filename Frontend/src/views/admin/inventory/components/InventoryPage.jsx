import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import InventoryStatsCards from './InventoryStatsCards';
import InventoryTabs from './InventoryTabs';
import InventorySearchBar from './InventorySearchBar';
import InventoryTable from './InventoryTable';
import AdjustStockModal from './AdjustStockModal';

import { inventoryService } from '../services/inventory.service';
import { normalizeText } from '../utils/normalizers';
import { formatCLP } from '../utils/formatters';

const LOW_STOCK_THRESHOLD = 5;

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSavingAdjust, setIsSavingAdjust] = useState(false);

  const token = useMemo(
    () => localStorage.getItem('accessToken') || localStorage.getItem('token') || '',
    []
  );

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await inventoryService.listProducts(token);
      const list = Array.isArray(res) ? res : (res?.data || []);
      setProducts(list);
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'No se pudo cargar el inventario.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const lowStockCount = products.filter((p) => {
      const stock = Number(p.stock ?? 0);
      return stock > 0 && stock < LOW_STOCK_THRESHOLD;
    }).length;

    const outOfStockCount = products.filter((p) => Number(p.stock ?? 0) === 0).length;

    const totalValue = products.reduce((acc, p) => {
      const stock = Number(p.stock ?? 0);
      const price = Number(p.precio ?? 0);
      return acc + stock * price;
    }, 0);

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalValue,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return products;

    return products.filter((p) => {
      const haystack = normalizeText(
        `${p.nombre ?? ''} ${p.editorial ?? ''} ${p.genero ?? ''}`
      );
      return haystack.includes(q);
    });
  }, [products, query]);

  const onAdjustStock = (product) => {
    setSelectedProduct(product);
    setShowAdjustModal(true);
  };

  const closeAdjustModal = () => {
    if (isSavingAdjust) return;
    setShowAdjustModal(false);
    setSelectedProduct(null);
  };

  const onConfirmAdjust = async (payload) => {
    try {
      setIsSavingAdjust(true);

      console.log('Ajuste de stock payload:', payload);

      Swal.fire('Listo', 'Ajuste registrado (frontend). Ahora vamos por el backend.', 'success');

      closeAdjustModal();

    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'No se pudo ajustar el stock.', 'error');
    } finally {
      setIsSavingAdjust(false);
    }
  };

  return (
    <div className="inventory-page p-4">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
        <div>
          <h2 className="mb-1">Gestión de Inventario</h2>
          <p className="text-muted mb-0">
            Valor total actual: <b>{formatCLP(stats.totalValue)}</b>
          </p>
        </div>
      </div>

      <InventoryStatsCards stats={stats} />

      <InventoryTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'inventory' ? (
        <div className="inventory-card card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <InventorySearchBar value={query} onChange={setQuery} />

            <InventoryTable
              products={filteredProducts}
              isLoading={isLoading}
              onAdjustStock={onAdjustStock}
            />
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body py-5 text-center">
            <h5 className="mb-2">Vista aún no implementada</h5>
            <p className="text-muted mb-0">
              Esta sección ({activeTab === 'movements' ? 'Movimientos' : 'Alertas'}) la haremos después.
            </p>
          </div>
        </div>
      )}

      {/* ✅ Modal Ajustar Stock */}
      <AdjustStockModal
        show={showAdjustModal}
        product={selectedProduct}
        onClose={closeAdjustModal}
        onConfirm={onConfirmAdjust}
        isSaving={isSavingAdjust}
      />
    </div>
  );
};

export default InventoryPage;
