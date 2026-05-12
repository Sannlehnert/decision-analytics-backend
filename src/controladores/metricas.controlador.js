import { metricasServicio } from '../servicios/metricas.servicio.js';

export const resumen = async (req, res, next) => {
  try {
    const datos = await metricasServicio.obtenerResumen(req.usuario.id);
    res.json(datos);
  } catch (error) {
    next(error);
  }
};

export const evolucion = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const datos = await metricasServicio.obtenerEvolucion(req.usuario.id, fechaInicio, fechaFin);
    res.json(datos);
  } catch (error) {
    next(error);
  }
};