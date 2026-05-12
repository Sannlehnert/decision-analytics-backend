import { usuarioRepositorio } from '../repositorios/usuario.repositorio.js';
import { crearAuthServicio } from './auth.servicio.js';

export const authServicio = crearAuthServicio(usuarioRepositorio);