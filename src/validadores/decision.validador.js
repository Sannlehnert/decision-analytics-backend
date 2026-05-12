import { z } from 'zod';

const categoriasValidas = ['trabajo', 'personal', 'salud', 'finanzas', 'educacion', 'otro'];
const prioridadesValidas = ['baja', 'media', 'alta', 'urgente'];
const estadosValidos = ['pendiente', 'en_seguimiento', 'cerrada', 'archivada'];

export const crearDecisionSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(255),
  descripcion: z.string().max(2000).optional().nullable(),
  categoria: z.enum(categoriasValidas),
  prioridad: z.enum(prioridadesValidas).default('media'),
});

export const actualizarDecisionSchema = z.object({
  titulo: z.string().min(5).max(255).optional(),
  descripcion: z.string().max(2000).optional().nullable(),
  categoria: z.enum(categoriasValidas).optional(),
  prioridad: z.enum(prioridadesValidas).optional(),
  estado: z.enum(estadosValidos).optional(),
});