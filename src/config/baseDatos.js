import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Cargar .env si existe (desarrollo), en producción las variables ya están
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const entorno = process.env.NODE_ENV || 'development';

const configuracion = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PUERTO, 10) || 5432,
    database: process.env.DB_NOMBRE,
    user: process.env.DB_USUARIO,
    password: process.env.DB_CLAVE,
    // En Render, también podemos usar DATABASE_URL si está definida
    ...(process.env.DATABASE_URL && { connectionString: process.env.DATABASE_URL }),
  },
  migrations: {
    directory: path.join(__dirname, '..', 'migrations'),
  },
  seeds: {
    directory: path.join(__dirname, '..', 'seeds'),
  },
};

const baseDatos = knex(configuracion);

export default baseDatos;