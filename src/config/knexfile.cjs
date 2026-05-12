const path = require('path');
const dotenv = require('dotenv');

// Cargar .env desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

module.exports = {
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
};