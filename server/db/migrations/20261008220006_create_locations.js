export async function up(knex) {
  await knex.raw(
    "create type location_kind as enum ('pantry', 'fridge', 'freezer')",
  )

  await knex.schema.createTable('locations', (table) => {
    table.increments('id')
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.string('name', 50).notNullable()
    table.specificType('kind', 'location_kind').notNullable()
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
    table.unique(['user_id', 'name'])
  })

  await knex.raw('alter table locations enable row level security')
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('locations')
  await knex.raw('drop type if exists location_kind')
}
