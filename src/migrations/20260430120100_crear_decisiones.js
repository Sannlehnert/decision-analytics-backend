export const up = async (knex) => {
  await knex.schema.createTable('decisiones', (t) => {
    t.increments('id').primary();
    t.integer('usuario_id').unsigned().notNullable().references('id').inTable('usuarios').onDelete('CASCADE');
    t.string('titulo', 255).notNullable();
    t.text('descripcion').nullable();
    t.string('categoria', 100).defaultTo('general');
    t.string('prioridad', 20).defaultTo('media');
    t.string('estado', 30).defaultTo('pendiente');
    t.timestamp('creado_en').defaultTo(knex.fn.now());
    t.timestamp('actualizado_en').defaultTo(knex.fn.now());
  });

  // Índice para consultas por usuario y estado
  await knex.schema.raw(`
    CREATE INDEX idx_decisiones_usuario_estado ON decisiones (usuario_id, estado);
  `);
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('decisiones');
};