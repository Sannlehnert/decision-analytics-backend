const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PUERTO, 10) || 5432,
      database: process.env.DB_NOMBRE,
      user: process.env.DB_USUARIO,
      password: process.env.DB_CLAVE,
      ...(process.env.DATABASE_URL && { connectionString: process.env.DATABASE_URL }),
    },
    migrations: {
      directory: path.join(__dirname, '..', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '..', 'seeds'),
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PUERTO, 10) || 5432,
      database: process.env.DB_NOMBRE,
      user: process.env.DB_USUARIO,
      password: process.env.DB_CLAVE,
      ...(process.env.DATABASE_URL && { connectionString: process.env.DATABASE_URL }),
    },
    migrations: {
      directory: path.join(__dirname, '..', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '..', 'seeds'),
    },
  },
};