export const emptyProduct = {
  id_producto: null,
  nombre: '',
  estado: 'disponible',
  descripcion: '',
  precio: '',
  stock: '',
  id_editorial: '',
  id_genero: '',
  imagen_url: '',
};

export const fromApiToForm = (p) => ({
  id_producto: p.id_producto,
  nombre: p.nombre ?? '',
  estado: p.estado ?? 'disponible',
  descripcion: p.descripcion ?? '',
  precio: String(p.precio ?? ''),
  stock: String(p.stock ?? ''),
  id_editorial: p.id_editorial ?? '',
  id_genero: p.id_genero ?? '',
  imagen_url: p.imagen_url ?? '',
});

export const toPayload = (form) => ({
  nombre: form.nombre.trim(),
  estado: form.estado,
  descripcion: form.descripcion?.trim() || '',
  precio: Number(form.precio),
  stock: Number(form.stock),
  imagen_url: form.imagen_url || '',
  id_editorial: form.id_editorial ? Number(form.id_editorial) : null,
  id_genero: form.id_genero ? Number(form.id_genero) : null,
});
