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
import baseDatos from './config/baseDatos.js';

async function iniciarServidor() {
  // Ejecutar migraciones automáticamente en cualquier entorno (en desarrollo ya las hiciste, no molesta)
  try {
    console.log('Verificando migraciones...');
    await baseDatos.migrate.latest();
    console.log('Migraciones actualizadas.');
  } catch (error) {
    console.error('Error al ejecutar migraciones:', error.message);
  }

  const app = express();
  const { puerto } = configurarEntorno;

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  configurarSwagger(app);

  app.use('/api/auth', rutasAuth);
  app.use('/api/decisiones', rutasDecisiones);
  app.use('/api/metricas', rutasMetricas);
  app.use('/api/categorias', rutasCategorias);

  app.use(manejadorErrores);

  app.listen(puerto, () => {
    console.log(`Servidor corriendo en puerto ${puerto}`);
  });
}

iniciarServidor();

export default app; // Para testing, aunque en producción no se usa