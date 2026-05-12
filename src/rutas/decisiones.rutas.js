import { Router } from 'express';
import { autenticar } from '../middlewares/autenticacion.js';
import { validar } from '../middlewares/validacion.js';
import {
  crearDecisionSchema,
  actualizarDecisionSchema,
} from '../validadores/decision.validador.js';
import {
  listar,
  crear,
  obtener,
  actualizar,
  eliminar,
} from '../controladores/decisiones.controlador.js';
import { agregarResultado } from '../controladores/resultado.controlador.js';
import { crearResultadoSchema } from '../validadores/resultado.validador.js';

const rutas = Router();

// Middleware de autenticación para todas las rutas
rutas.use(autenticar);

/**
 * @swagger
 * /decisiones:
 *   get:
 *     summary: Listar decisiones del usuario autenticado
 *     tags: [Decisiones]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de decisiones
 */
rutas.get('/', listar);

/**
 * @swagger
 * /decisiones:
 *   post:
 *     summary: Crear una nueva decisión
 *     tags: [Decisiones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearDecision'
 *     responses:
 *       201:
 *         description: Decisión creada
 */
rutas.post('/', validar(crearDecisionSchema), crear);

/**
 * @swagger
 * /decisiones/{id}:
 *   get:
 *     summary: Obtener una decisión por ID
 *     tags: [Decisiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Decisión encontrada
 */
rutas.get('/:id', obtener);

/**
 * @swagger
 * /decisiones/{id}:
 *   put:
 *     summary: Actualizar una decisión
 *     tags: [Decisiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarDecision'
 *     responses:
 *       200:
 *         description: Decisión actualizada
 */
rutas.put('/:id', validar(actualizarDecisionSchema), actualizar);

/**
 * @swagger
 * /decisiones/{id}:
 *   delete:
 *     summary: Eliminar una decisión
 *     tags: [Decisiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Decisión eliminada
 */
rutas.delete('/:id', eliminar);

rutas.post('/:id/resultado', validar(crearResultadoSchema), agregarResultado);

export default rutas;