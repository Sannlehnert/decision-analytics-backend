import { Router } from 'express';
import { registro, login } from '../controladores/auth.controlador.js';
import { validar } from '../middlewares/validacion.js';
import { registroSchema, loginSchema } from '../validadores/auth.validador.js';

const rutas = Router();

/**
 * @swagger
 * /auth/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, clave]
 *             properties:
 *               email:
 *                 type: string
 *               clave:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
rutas.post('/registro', validar(registroSchema), registro);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 */
rutas.post('/login', validar(loginSchema), login);

export default rutas;