export async function up(knex) {
  await knex.schema.createTable('food_items', (table) => {
    table.increments('id')
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .integer('location_id')
      .notNullable()
      .references('id')
      .inTable('locations')
      .onDelete('RESTRICT')
    table.string('name', 100).notNullable()
    table.decimal('quantity', 8, 2).notNullable().defaultTo(1)
    table.string('unit', 20)
    table.date('expiration_date')
    table.boolean('is_dish').notNullable().defaultTo(false)
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())

    table.index(['user_id', 'expiration_date'])
    table.index(['user_id', 'name'])
    table.index('location_id')
  })

  await knex.raw(`
    alter table food_items
      add constraint food_items_quantity_check check (quantity >= 0)
  `)

  await knex.raw('alter table food_items enable row level security')
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('food_items')
}
