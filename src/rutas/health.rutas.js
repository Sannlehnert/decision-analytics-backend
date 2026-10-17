import { Router } from 'express';
import pg from 'pg';
import baseDatos from '../config/baseDatos.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Comprueba la conexión a PostgreSQL
 *     security: []
 *     responses:
 *       200:
 *         description: API y base de datos disponibles
 *       503:
 *         description: Base de datos no disponible
 */
router.get('/', async (_req, res) => {
  // Conexión aislada: no modifica los tiempos de las consultas de negocio.
  const cliente = new pg.Client({
    ...baseDatos.client.config.connection,
    // Knex oculta estas propiedades del operador spread.
    password: baseDatos.client.config.connection.password,
    connectionString: baseDatos.client.config.connection.connectionString,
    connectionTimeoutMillis: 2000,
    query_timeout: 2000,
  });
  res.set('Cache-Control', 'no-store');
  try {
    await cliente.connect();
    await cliente.query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'up' });
  } catch {
    res.status(503).json({ status: 'unavailable', database: 'down' });
  } finally {
    await cliente.end().catch(() => {});
  }
});

export default router;
