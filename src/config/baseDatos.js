import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env antes que nada
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaRaiz = path.resolve(__dirname, '..', '..');
dotenv.config({ path: path.join(rutaRaiz, '.env') });

// Forzar knex como CommonJS
const require = createRequire(import.meta.url);
const knex = require('knex');

const entorno = process.env.NODE_ENV || 'development';

const configuracion = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PUERTO, 10),
      database: process.env.DB_NOMBRE,
      user: process.env.DB_USUARIO,
      password: process.env.DB_CLAVE,
    },
    migrations: {
      directory: path.join(__dirname, '..', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '..', 'seeds'),
    },
  },
  // Agregamos entorno test idéntico a development
  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PUERTO, 10),
      database: process.env.DB_NOMBRE,
      user: process.env.DB_USUARIO,
      password: process.env.DB_CLAVE,
    },
    migrations: {
      directory: path.join(__dirname, '..', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '..', 'seeds'),
    },
  },
};

const baseDatos = knex(configuracion[entorno]);

export default baseDatos;