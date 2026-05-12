import { authServicio } from '../servicios/index.js';

export const registro = async (req, res, next) => {
  try {
    const { email, clave } = req.body;
    const usuario = await authServicio.registrar({ email, clave });
    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, clave } = req.body;
    const resultado = await authServicio.login({ email, clave });
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};