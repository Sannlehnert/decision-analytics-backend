import { Router } from 'express';
import { autenticar } from '../middlewares/autenticacion.js';
import { resumen, evolucion } from '../controladores/metricas.controlador.js';

const rutas = Router();
rutas.use(autenticar);

rutas.get('/', resumen);
rutas.get('/evolucion', evolucion);

export default rutas;