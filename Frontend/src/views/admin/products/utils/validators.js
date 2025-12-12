export const validateProduct = (form) => {
  const errors = {};

  if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
  if (!form.estado) errors.estado = 'El estado es obligatorio';

  if (!form.precio) errors.precio = 'El precio es obligatorio';
  else if (!Number.isFinite(Number(form.precio))) errors.precio = 'El precio debe ser numérico';
  else if (Number(form.precio) <= 0) errors.precio = 'El precio debe ser mayor a 0';

  if (form.stock === '') errors.stock = 'El stock es obligatorio';
  else if (!Number.isFinite(Number(form.stock))) errors.stock = 'El stock debe ser numérico';
  else if (Number(form.stock) < 0) errors.stock = 'El stock no puede ser negativo';

  if (!form.id_editorial) errors.id_editorial = 'Debes seleccionar una editorial';
  if (!form.id_genero) errors.id_genero = 'Debes seleccionar un género';

  return errors;
};
