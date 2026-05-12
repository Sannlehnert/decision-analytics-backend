import { resultadoServicio } from '../servicios/resultado.servicio.js';

export const agregarResultado = async (req, res, next) => {
  try {
    const decisionId = Number(req.params.id);
    const mensaje = await resultadoServicio.agregarResultado(
      decisionId,
      req.usuario.id,
      req.body
    );
    res.status(201).json(mensaje);
  } catch (error) {
    next(error);
  }
};