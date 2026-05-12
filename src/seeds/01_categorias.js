export const seed = async (knex) => {
  const bcrypt = (await import('bcrypt')).default;
  const hash = await bcrypt.hash('12345678', 12);

  // Insertar usuario demo sin especificar ID
  await knex('usuarios').insert({ email: 'demo@ejemplo.com', clave_hash: hash });

  // Insertar decisiones demo sin IDs
  await knex('decisiones').insert([
    { usuario_id: knex('usuarios').select('id').where('email', 'demo@ejemplo.com').first(), 
      titulo: 'Cambiar de trabajo', descripcion: 'Evaluar oferta', categoria: 'trabajo', prioridad: 'alta', estado: 'pendiente' },
    { usuario_id: knex('usuarios').select('id').where('email', 'demo@ejemplo.com').first(),
      titulo: 'Empezar dieta', categoria: 'salud', prioridad: 'media', estado: 'cerrada' },
  ]);

  // El resultado también sin ID fijo, referenciando la decisión "Empezar dieta"
  const decision = await knex('decisiones').where('titulo', 'Empezar dieta').first();
  if (decision) {
    await knex('resultados').insert({
      decision_id: decision.id,
      tipo: 'positivo',
      descripcion: 'Bajé 3kg en un mes',
    });
  }
};