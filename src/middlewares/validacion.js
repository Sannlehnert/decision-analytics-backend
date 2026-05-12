import { ErrorPersonalizado } from '../utils/errores.js';

export const validar = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.issues) {
      const detalles = error.issues.map((i) => ({ campo: i.path.join('.'), mensaje: i.message }));
      next(new ErrorPersonalizado('Datos inválidos', 'Validacion', detalles));
    } else {
      next(error);
    }
  }
};