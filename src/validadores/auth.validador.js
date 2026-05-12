import { z } from 'zod';

export const registroSchema = z.object({
  email: z.string().email('Email inválido'),
  clave: z.string().min(8, 'La clave debe tener al menos 8 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  clave: z.string().min(1, 'La clave es requerida'),
});