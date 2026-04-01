import { z } from 'zod';

export const cartItemSchema = z.object({
  id_producto: z.number().int().positive(),
  cantidad:    z.number().int().min(0),
});

export const customerInfoSchema = z.object({
  nombre:   z.string().min(1).max(100),
  apellido: z.string().min(1).max(100),
  email:    z.string().email(),
  telefono: z.string().max(20).optional(),
});

export const shippingAddressSchema = z.object({
  direccion:      z.string().min(1).max(200),
  ciudad:         z.string().min(1).max(100),
  pais:           z.string().min(1).max(100),
  codigo_postal:  z.string().max(20).optional(),
});

export const checkoutSchema = z.object({
  metodo_entrega: z.enum(['retiro', 'envio']),
});