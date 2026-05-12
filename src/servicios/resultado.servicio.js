import baseDatos from '../config/baseDatos.js';
import { ErrorPersonalizado } from '../utils/errores.js';

export const resultadoServicio = {
  agregarResultado: async (decisionId, usuarioId, datos) => {
    const decision = await baseDatos('decisiones')
      .where({ id: decisionId, usuario_id: usuarioId })
      .first();
    if (!decision) throw new ErrorPersonalizado('Decisión no encontrada', 'NoEncontrado');

    // Insertar resultado
    await baseDatos('resultados').insert({
      decision_id: decisionId,
      tipo: datos.tipo,
      descripcion: datos.descripcion || null,
    });

    // Cerrar automáticamente la decisión
    await baseDatos('decisiones')
      .where({ id: decisionId })
      .update({ estado: 'cerrada', actualizado_en: baseDatos.fn.now() });

    return { mensaje: 'Resultado registrado y decisión cerrada' };
  },
};