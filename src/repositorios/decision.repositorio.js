import baseDatos from '../config/baseDatos.js';

export const decisionRepositorio = {
  crear: async (datos) => {
    const [id] = await baseDatos('decisiones').insert(datos).returning('id');
    return id;
  },

  buscarPorIdYUsuario: async (id, usuarioId) => {
    return baseDatos('decisiones')
      .where({ id, usuario_id: usuarioId })
      .first();
  },

  listarPorUsuario: async (usuarioId, filtros = {}) => {
    const query = baseDatos('decisiones').where({ usuario_id: usuarioId });
    if (filtros.estado) query.where({ estado: filtros.estado });
    if (filtros.categoria) query.where({ categoria: filtros.categoria });
    if (filtros.prioridad) query.where({ prioridad: filtros.prioridad });
    return query.orderBy('creado_en', 'desc');
  },

  actualizar: async (id, usuarioId, datos) => {
    return baseDatos('decisiones')
      .where({ id, usuario_id: usuarioId })
      .update(datos)
      .returning('*');
  },

  eliminar: async (id, usuarioId) => {
    return baseDatos('decisiones')
      .where({ id, usuario_id: usuarioId })
      .del();
  },
};