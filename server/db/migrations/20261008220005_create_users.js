export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('auth_id', 255).notNullable().unique()
    table.string('email', 255).notNullable().unique()
    table.integer('warning_days').notNullable().defaultTo(5)
    table.integer('urgent_days').notNullable().defaultTo(2)
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
  })

  await knex.raw(`
    alter table users
      add constraint users_urgent_days_check check (urgent_days >= 0),
      add constraint users_warning_days_check check (warning_days >= urgent_days)
  `)

  await knex.raw('alter table users enable row level security')
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users')
}
