import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'El identificador es obligatorio.').max(100),
  password:   z.string().min(1, 'La contraseña es obligatoria.').max(100),
});

export const registerCustomerSchema = z.object({
  username:  z.string().min(3).max(50),
  email:     z.string().email('Email inválido.'),
  password:  z.string().min(6, 'Mínimo 6 caracteres.').max(100),
  nombre:    z.string().min(1).max(100),
  apellido:  z.string().min(1).max(100),
  telefono:  z.string().max(20).optional(),
  image_profile: z.string().max(5000).optional(), // base64 o url
});

export const editProfileSchema = z.object({
  username:      z.string().min(3).max(50).optional(),
  email:         z.string().email().optional(),
  nombre:        z.string().min(1).max(100).optional(),
  apellido:      z.string().min(1).max(100).optional(),
  telefono:      z.string().max(20).optional(),
  image_profile: z.string().max(5000).optional(),
  password:      z.string().min(6).max(100).optional(),
});