import * as dotenv from 'dotenv';

dotenv.config();

export const configurarEntorno = {
  puerto: process.env.PUERTO || 3000,
  jwt: {
    secreto: process.env.JWT_SECRETO,
    expiracion: process.env.JWT_EXPIRACION || '2h',
  },
  baseDatos: {
    host: process.env.DB_HOST,
    puerto: parseInt(process.env.DB_PUERTO, 10),
    nombre: process.env.DB_NOMBRE,
    usuario: process.env.DB_USUARIO,
    clave: process.env.DB_CLAVE,
  },
};