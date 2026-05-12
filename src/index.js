import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { configurarEntorno } from './config/entorno.js';
import rutasAuth from './rutas/auth.rutas.js';
import rutasDecisiones from './rutas/decisiones.rutas.js';
import rutasMetricas from './rutas/metricas.rutas.js';
import rutasCategorias from './rutas/categorias.rutas.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { configurarSwagger } from './config/swagger.js';

const app = express();
const { puerto } = configurarEntorno;

// Seguridad y parseo
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger
configurarSwagger(app);

// Rutas
app.use('/api/auth', rutasAuth);
app.use('/api/decisiones', rutasDecisiones);
app.use('/api/metricas', rutasMetricas);
app.use('/api/categorias', rutasCategorias);

// Manejo centralizado de errores (siempre después de las rutas)
app.use(manejadorErrores);

// Inicio
app.listen(puerto, () => {
  console.log(`Servidor corriendo en puerto ${puerto}`);
});

export default app; // Para testing