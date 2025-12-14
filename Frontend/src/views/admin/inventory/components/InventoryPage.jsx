import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import InventoryStatsCards from "./InventoryStatsCards";
import InventoryTabs from "./InventoryTabs";
import InventorySearchBar from "./InventorySearchBar";
import InventoryTable from "./InventoryTable";
import AdjustStockModal from "./AdjustStockModal";
import InventoryAlerts from "./InventoryAlerts";

import MovementsFilters from "./MovementsFilters";
import MovementsTable from "./MovementsTable";

import { inventoryService } from "../services/inventory.service";
import { normalizeText } from "../utils/normalizers";
import { formatCLP } from "../utils/formatters";
import { toISODateInputValue } from "../utils/date";

const LOW_STOCK_THRESHOLD = 5;

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  // Inventory tab
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Adjust modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSavingAdjust, setIsSavingAdjust] = useState(false);

  // Movements tab
  const [movements, setMovements] = useState([]);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);

  const [movQuery, setMovQuery] = useState("");
  const [movType, setMovType] = useState("all");
  const [movFrom, setMovFrom] = useState("");
  const [movTo, setMovTo] = useState("");

  const token = useMemo(
    () => localStorage.getItem("accessToken") || localStorage.getItem("token") || "",
    []
  );

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await inventoryService.listProducts(token);
      const list = Array.isArray(res) ? res : res?.data || [];
      setProducts(list);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo cargar el inventario.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovements = async () => {
    setIsLoadingMovements(true);
    try {
      const res = await inventoryService.listMovements(token);
      const list = Array.isArray(res) ? res : res?.data || [];
      setMovements(list);

      if (list.length > 0 && !movFrom && !movTo) {
        const today = new Date();
        const from = new Date();
        from.setDate(today.getDate() - 30);
        setMovFrom(toISODateInputValue(from));
        setMovTo(toISODateInputValue(today));
      }
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
    if (activeTab === "movements" && movements.length === 0) {
      fetchMovements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // stats
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

  const filteredMovements = useMemo(() => {
    let list = [...movements];

    // tipo
    if (movType !== "all") {
      list = list.filter((m) => m.tipo === movType);
    }

    // rango de fechas
    const from = movFrom ? new Date(`${movFrom}T00:00:00`) : null;
    const to = movTo ? new Date(`${movTo}T23:59:59`) : null;

    if (from && !Number.isNaN(from.getTime())) {
      list = list.filter((m) => {
        const d = new Date(m.fecha_movimiento);
        return !Number.isNaN(d.getTime()) && d >= from;
      });
    }

    if (to && !Number.isNaN(to.getTime())) {
      list = list.filter((m) => {
        const d = new Date(m.fecha_movimiento);
        return !Number.isNaN(d.getTime()) && d <= to;
      });
    }

    // búsqueda
    const q = normalizeText(movQuery);
    if (q) {
      list = list.filter((m) => {
        const hay = normalizeText(`${m.producto ?? ""} ${m.motivo ?? ""} ${m.usuario ?? ""}`);
        return hay.includes(q);
      });
    }

    return list;
  }, [movements, movType, movFrom, movTo, movQuery]);

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
      await fetchInventory();
      await fetchMovements();

      Swal.fire("Éxito", "Stock ajustado correctamente.", "success");
      closeAdjustModal();
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "No se pudo ajustar el stock.";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSavingAdjust(false);
    }
  };

  const clearMovFilters = () => {
    setMovQuery("");
    setMovType("all");
    setMovFrom("");
    setMovTo("");
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
              isLoading={isLoading}
              onAdjustStock={onAdjustStock}
            />
          </div>
        </div>
      ) : activeTab === "movements" ? (
        <div className="inventory-card card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h5 className="mb-3">Historial de Movimientos</h5>

            <MovementsFilters
              query={movQuery}
              onQuery={setMovQuery}
              type={movType}
              onType={setMovType}
              from={movFrom}
              onFrom={setMovFrom}
              to={movTo}
              onTo={setMovTo}
              onClear={clearMovFilters}
            />

            <MovementsTable movements={filteredMovements} isLoading={isLoadingMovements} />
          </div>
        </div>
      ) :  activeTab === 'alerts' ? (
        <InventoryAlerts
          products={products}
          onReStock={onAdjustStock}
        />
      ) : (
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body py-5 text-center">
            <h5 className="mb-2">Vista aún no implementada</h5>
            <p className="text-muted mb-0">Esta sección () la haremos después.</p>
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
