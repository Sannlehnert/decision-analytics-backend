import { decisionServicio } from '../servicios/decision.servicio.js';

export const crear = async (req, res, next) => {
  try {
    const decision = await decisionServicio.crear(req.usuario.id, req.body);
    res.status(201).json(decision);
  } catch (error) {
    next(error);
  }
};

export const listar = async (req, res, next) => {
  try {
    const decisiones = await decisionServicio.listar(req.usuario.id, req.query);
    res.json(decisiones);
  } catch (error) {
    next(error);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const decision = await decisionServicio.obtenerPorId(Number(req.params.id), req.usuario.id);
    res.json(decision);
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const decision = await decisionServicio.actualizar(id, req.usuario.id, req.body);
    res.json(decision);
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await decisionServicio.eliminar(Number(req.params.id), req.usuario.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};