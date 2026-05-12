import baseDatos from '../config/baseDatos.js';

export const usuarioRepositorio = {
  crear: async ({ email, claveHash }) => {
    const [id] = await baseDatos('usuarios').insert({ email, clave_hash: claveHash }).returning('id');
    return id;
  },

  buscarPorEmail: async (email) => {
    return baseDatos('usuarios').where({ email }).first();
  },

  buscarPorId: async (id) => {
    return baseDatos('usuarios').where({ id }).first();
  },
};