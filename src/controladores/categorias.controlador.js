const CATEGORIAS = ['trabajo', 'personal', 'salud', 'finanzas', 'educacion', 'otro'];

export const listarCategorias = (req, res) => {
  res.json(CATEGORIAS);
};