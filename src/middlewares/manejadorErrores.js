export const manejadorErrores = (err, req, res, _next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error no controlado:', err);
  }

  if (err.tipo && err.tipo === 'Validacion') {
    return res.status(400).json({ error: err.message, detalles: err.detalles });
  }

  if (err.tipo && err.tipo === 'Autorizacion') {
    return res.status(403).json({ error: err.message });
  }

  if (err.tipo && err.tipo === 'NoEncontrado') {
    return res.status(404).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Error interno del servidor' });
};