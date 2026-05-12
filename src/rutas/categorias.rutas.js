import { Router } from 'express';
import { listarCategorias } from '../controladores/categorias.controlador.js';

const rutas = Router();

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Obtener lista de categorías disponibles
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
rutas.get('/', listarCategorias);

export default rutas;