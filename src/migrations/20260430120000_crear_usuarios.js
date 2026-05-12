export const up = async (knex) => {
  await knex.schema.createTable('usuarios', (t) => {
    t.increments('id').primary();
    t.string('email', 255).notNullable().unique();
    t.string('clave_hash', 255).notNullable();
    t.timestamp('creado_en').defaultTo(knex.fn.now());
    t.timestamp('actualizado_en').defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('usuarios');
};