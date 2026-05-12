import baseDatos from '../config/baseDatos.js';
import { decisionRepositorio } from '../repositorios/decision.repositorio.js';
import { ErrorPersonalizado } from '../utils/errores.js';

export const decisionServicio = {
  crear: async (usuarioId, datos) => {
    const decision = {
      ...datos,
      usuario_id: usuarioId,
      estado: 'pendiente', // siempre inicia pendiente
    };
    const id = await decisionRepositorio.crear(decision);
    return { id, ...decision };
  },

  obtenerPorId: async (id, usuarioId) => {
    const decision = await decisionRepositorio.buscarPorIdYUsuario(id, usuarioId);
    if (!decision) throw new ErrorPersonalizado('Decisión no encontrada', 'NoEncontrado');
    return decision;
  },

  listar: async (usuarioId, filtros) => {
    return decisionRepositorio.listarPorUsuario(usuarioId, filtros);
  },

  actualizar: async (id, usuarioId, datos) => {
    const decision = await decisionRepositorio.buscarPorIdYUsuario(id, usuarioId);
    if (!decision) throw new ErrorPersonalizado('Decisión no encontrada', 'NoEncontrado');

    // Regla: no se puede cerrar una decisión sin haber registrado resultado
    if (datos.estado === 'cerrada') {
      const resultado = await baseDatos('resultados')
        .where({ decision_id: id })
        .first();
      if (!resultado) {
        throw new ErrorPersonalizado(
          'No se puede cerrar una decisión sin registrar un resultado',
          'Validacion'
        );
      }
    }

    const [actualizada] = await decisionRepositorio.actualizar(id, usuarioId, datos);
    return actualizada;
  },

  eliminar: async (id, usuarioId) => {
    const decision = await decisionRepositorio.buscarPorIdYUsuario(id, usuarioId);
    if (!decision) throw new ErrorPersonalizado('Decisión no encontrada', 'NoEncontrado');
    await decisionRepositorio.eliminar(id, usuarioId);
  },
};