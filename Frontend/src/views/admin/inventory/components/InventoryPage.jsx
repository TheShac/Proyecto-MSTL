import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import InventoryStatsCards from "./InventoryStatsCards";
import InventoryTabs from "./InventoryTabs";
import InventorySearchBar from "./InventorySearchBar";
import InventoryTable from "./InventoryTable";
import AdjustStockModal from "./AdjustStockModal";
import InventoryMovementsTable from "./InventoryMovementsTable";
import InventoryAlerts from './InventoryAlerts';

import { inventoryService } from "../services/inventory.service";
import { normalizeText } from "../utils/normalizers";
import { formatCLP } from "../utils/formatters";

const LOW_STOCK_THRESHOLD = 5;

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [query, setQuery] = useState("");

  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSavingAdjust, setIsSavingAdjust] = useState(false);

  const token = useMemo(
    () => localStorage.getItem("accessToken") || localStorage.getItem("token") || "",
    []
  );

  const fetchInventory = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await inventoryService.listProducts(token);
      const list = Array.isArray(res) ? res : res?.data || [];
      setProducts(list);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo cargar el inventario.", "error");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchMovements = async () => {
    setIsLoadingMovements(true);
    try {
      const res = await inventoryService.listMovements(token);
      const list = Array.isArray(res) ? res : res?.data || [];
      setMovements(list);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudieron cargar los movimientos.", "error");
    } finally {
      setIsLoadingMovements(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "movements") fetchMovements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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

    return { totalProducts, lowStockCount, outOfStockCount, totalValue };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return products;

    return products.filter((p) => {
      const haystack = normalizeText(`${p.nombre ?? ""} ${p.editorial ?? ""} ${p.genero ?? ""}`);
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

      const body = {
        id_producto: payload.productId,
        tipo: payload.type,
        cantidad: payload.quantity,
        motivo: payload.reason,
      };

      await inventoryService.adjustStock(body, token);

      Swal.fire("Éxito", "Stock ajustado correctamente.", "success");

      closeAdjustModal();
      await fetchInventory();

      if (activeTab === "movements") await fetchMovements();
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "No se pudo ajustar el stock.";
      Swal.fire("Error", msg, "error");
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

      {activeTab === "inventory" ? (
        <div className="inventory-card card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <InventorySearchBar value={query} onChange={setQuery} />
            <InventoryTable
              products={filteredProducts}
              isLoading={isLoadingProducts}
              onAdjustStock={onAdjustStock}
            />
          </div>
        </div>
      ) : activeTab === "movements" ? (
        <div className="inventory-card card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <InventoryMovementsTable movements={movements} isLoading={isLoadingMovements} />
          </div>
        </div>
      ) : activeTab === 'alerts' ? (
        <InventoryAlerts
          products={products}
          onReStock={onAdjustStock}
        />
      ) : (
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body py-5 text-center">
            <h5 className="mb-2">Vista aún no implementada</h5>
            <p className="text-muted mb-0">Esta sección ({activeTab}) la haremos después.</p>
          </div>
        </div>
      )}

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
