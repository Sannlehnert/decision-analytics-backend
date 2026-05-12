import baseDatos from '../config/baseDatos.js';

export const metricasServicio = {
  obtenerResumen: async (usuarioId) => {
    const total = await baseDatos('decisiones')
      .where({ usuario_id: usuarioId })
      .count('* as total')
      .first();

    const porEstado = await baseDatos('decisiones')
      .where({ usuario_id: usuarioId })
      .select('estado')
      .count('* as cantidad')
      .groupBy('estado');

    const resultados = await baseDatos('resultados')
      .join('decisiones', 'resultados.decision_id', 'decisiones.id')
      .where('decisiones.usuario_id', usuarioId)
      .select('resultados.tipo')
      .count('* as cantidad')
      .groupBy('resultados.tipo');

    const positivos = resultados.find(r => r.tipo === 'positivo')?.cantidad || 0;
    const neutros = resultados.find(r => r.tipo === 'neutro')?.cantidad || 0;
    const negativos = resultados.find(r => r.tipo === 'negativo')?.cantidad || 0;

    return {
      totalDecisiones: Number(total.total),
      porEstado,
      resultados: { positivos, neutros, negativos },
    };
  },

  obtenerEvolucion: async (usuarioId, fechaInicio, fechaFin) => {
    const query = baseDatos('decisiones')
      .where('usuario_id', usuarioId)
      .select(baseDatos.raw('DATE(creado_en) as fecha'))
      .count('* as cantidad')
      .groupByRaw('DATE(creado_en)')
      .orderBy('fecha');

    if (fechaInicio) query.where('creado_en', '>=', fechaInicio);
    if (fechaFin) query.where('creado_en', '<=', fechaFin);

    return query;
  },
};