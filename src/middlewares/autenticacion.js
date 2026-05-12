import jwt from 'jsonwebtoken';
import { configurarEntorno } from '../config/entorno.js';

export const autenticar = (req, res, next) => {
  const cabecera = req.headers.authorization;

  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = cabecera.split(' ')[1];

  try {
    const decodificado = jwt.verify(token, configurarEntorno.jwt.secreto);
    req.usuario = { id: decodificado.id, email: decodificado.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};