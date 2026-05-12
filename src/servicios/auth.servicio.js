import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import { configurarEntorno } from '../config/entorno.js';
import { ErrorPersonalizado } from '../utils/errores.js';

// El servicio ahora recibe el repositorio como dependencia.
// En producción se le pasará usuarioRepositorio real.
export const crearAuthServicio = (usuarioRepositorio) => ({
  registrar: async ({ email, clave }) => {
    const existente = await usuarioRepositorio.buscarPorEmail(email);
    if (existente) {
      throw new ErrorPersonalizado('El email ya está registrado', 'Validacion');
    }

    const claveHash = await bcrypt.hash(clave, 12);
    const id = await usuarioRepositorio.crear({ email, claveHash });
    return { id, email };
  },

  login: async ({ email, clave }) => {
    const usuario = await usuarioRepositorio.buscarPorEmail(email);
    if (!usuario) {
      throw new ErrorPersonalizado('Credenciales inválidas', 'Autorizacion');
    }

    const coincide = await bcrypt.compare(clave, usuario.clave_hash);
    if (!coincide) {
      throw new ErrorPersonalizado('Credenciales inválidas', 'Autorizacion');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      configurarEntorno.jwt.secreto,
      { expiresIn: configurarEntorno.jwt.expiracion }
    );

    return { token, usuario: { id: usuario.id, email: usuario.email } };
  },
});