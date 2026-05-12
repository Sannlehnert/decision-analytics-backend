import { z } from 'zod';

export const crearResultadoSchema = z.object({
  tipo: z.enum(['positivo', 'neutro', 'negativo']),
  descripcion: z.string().max(1000).optional(),
});