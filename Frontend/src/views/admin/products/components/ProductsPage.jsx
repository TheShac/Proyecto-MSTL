import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import ProductSearchBar from "./ProductsSearchBar";
import ProductsTable from "./ProductsTable";
import ProductModal from "./ProductModal";

import FeaturedProductsModal from "../featured/components/FeaturedProductsModal";
import OffersModal from "../../offers/components/OffersModal";

import { productService } from "../services/product.service";
import { emptyProduct, fromApiToForm, toPayload } from "../mappers/product.mapper";
import { validateProduct } from "../utils/validators";
import { normalizeText } from "../utils/formatters";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [genres, setGenres] = useState([]);

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState(emptyProduct);
  const [errors, setErrors] = useState({});

  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);

  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    "";

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [prods, eds, gens] = await Promise.all([
        productService.list(token),
        productService.getEditorials(),
        productService.getGenres(),
      ]);

      setProducts(prods);
      setEditorials(eds);
      setGenres(gens);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar los datos.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = useMemo(() => {
    const q = normalizeText(search);
    if (!q) return products;

    return products.filter((p) => {
      const nombre = normalizeText(p.nombre);
      const editorial = normalizeText(p.editorial);
      const genero = normalizeText(p.genero);

      return nombre.includes(q) || editorial.includes(q) || genero.includes(q);
    });
  }, [products, search]);

  // ✅ CRUD producto
  const openCreate = () => {
    setIsEditing(false);
    setErrors({});
    setForm(emptyProduct);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setIsEditing(true);
    setErrors({});
    setForm(fromApiToForm(product));
    setShowModal(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setShowModal(false);
    setIsEditing(false);
    setErrors({});
    setForm(emptyProduct);
  };

  const onChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((prev) => ({ ...prev, imagen_url: e.target?.result || "" }));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const v = validateProduct(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setIsSaving(true);
    try {
      const payload = toPayload(form);

      if (isEditing) {
        await productService.update(form.id_producto, payload, token);
        Swal.fire("Éxito", "Producto actualizado", "success");
      } else {
        await productService.create(payload, token);
        Swal.fire("Éxito", "Producto creado", "success");
      }

      closeModal();
      await loadAll();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err?.response?.data?.message || "No se pudo guardar el producto",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async (product) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: `Se eliminará "${product.nombre}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
    });

    if (!result.isConfirmed) return;

    try {
      await productService.remove(product.id_producto, token);
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
      await loadAll();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  // ✅ Destacados
  const openFeatured = () => {
    if (!token) {
      Swal.fire(
        "Sin sesión",
        "Debes iniciar sesión como admin para gestionar destacados.",
        "warning"
      );
      return;
    }
    setShowFeaturedModal(true);
  };

  const closeFeatured = () => {
    setShowFeaturedModal(false);
  };

  // ✅ Ofertas
  const openOffers = () => {
    if (!token) {
      Swal.fire("Sin sesión", "Debes iniciar sesión como admin.", "warning");
      return;
    }
    setShowOffersModal(true);
  };

  const closeOffers = () => {
    setShowOffersModal(false);
  };

  return (
    <div className="container-fluid py-4 products-page">
      <ProductSearchBar
        title="Gestión de Productos"
        search={search}
        onSearchChange={setSearch}
        onCreate={openCreate}
        onOpenFeatured={openFeatured}
        onOpenOffers={openOffers}
      />

      <div className="card shadow border-0 rounded-4 w-100 products-card">
        <div className="card-body">
          {isLoading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-warning" role="status" />
              <p className="mt-3">Cargando productos...</p>
            </div>
          ) : (
            <ProductsTable
              products={filteredProducts}
              onEdit={openEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>

      <ProductModal
        show={showModal}
        isEditing={isEditing}
        form={form}
        errors={errors}
        isSaving={isSaving}
        editorials={editorials}
        genres={genres}
        onClose={closeModal}
        onSubmit={onSubmit}
        onChange={onChange}
        onImageUpload={onImageUpload}
      />

      <FeaturedProductsModal
        show={showFeaturedModal}
        onClose={closeFeatured}
        token={token}
      />

      <OffersModal
        show={showOffersModal}
        onClose={closeOffers}
        token={token}
      />
    </div>
  );
};

export default ProductsPage;
