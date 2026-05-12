export const up = async (knex) => {
  await knex.schema.createTable('resultados', (t) => {
    t.increments('id').primary();
    t.integer('decision_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('decisiones')
      .onDelete('CASCADE');
    t.enum('tipo', ['positivo', 'neutro', 'negativo']).notNullable();
    t.text('descripcion').nullable();
    t.timestamp('creado_en').defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('resultados');
};