import connection from './connection.ts'
import { createDefaultLocations } from './locations.ts'

if (process.env.NODE_ENV === 'production') {
  throw new Error('Refusing to run the dev seed in production')
}

const SEED_AUTH_ID = 'seed-user'
const SEED_EMAIL = 'seed@example.com'

// Today + N days as 'YYYY-MM-DD', in local time.
// The 'en-CA' locale happens to format dates in exactly that shape.
function daysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-CA')
}

async function seed() {
  // 1. The test user: created once, found again on later runs
  await connection('users')
    .insert({ auth_id: SEED_AUTH_ID, email: SEED_EMAIL })
    .onConflict('auth_id')
    .ignore()
  const user = await connection('users')
    .where({ auth_id: SEED_AUTH_ID })
    .first()

  // 2. Pantry, Fridge, Freezer
  const locations = await createDefaultLocations(user.id)
  const idByKind = Object.fromEntries(locations.map((l) => [l.kind, l.id]))

  // 3. Throw away the seed user's old items, then add fresh ones.
  //    Dates are relative to today, so they must be recalculated each run.
  await connection('food_items').where({ user_id: user.id }).del()

  const items = [
    {
      name: 'Spinach',
      quantity: 1,
      unit: 'bag',
      expiration_date: daysFromNow(1), // red
      is_dish: false,
      location_id: idByKind.fridge,
    },
    {
      name: 'Carrots',
      quantity: 4,
      unit: 'count',
      expiration_date: daysFromNow(4), // orange
      is_dish: false,
      location_id: idByKind.fridge,
    },
    {
      name: 'Pasta sauce',
      quantity: 2,
      unit: 'jars',
      expiration_date: daysFromNow(20), // normal
      is_dish: false,
      location_id: idByKind.pantry,
    },
    {
      name: 'Salt',
      quantity: 1,
      unit: 'kg',
      expiration_date: null, // no expiry
      is_dish: false,
      location_id: idByKind.pantry,
    },
    {
      name: 'Leftover chilli',
      quantity: 2,
      unit: 'servings',
      expiration_date: daysFromNow(7), // dish in fridge: 7 days (decision 5)
      is_dish: true,
      location_id: idByKind.fridge,
    },
  ]

  await connection('food_items').insert(
    items.map((item) => ({ ...item, user_id: user.id })),
  )

  // eslint-disable-next-line no-console
  console.log(`Seeded ${items.length} items for ${SEED_EMAIL}`)
}

seed()
  .finally(() => connection.destroy())
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exitCode = 1
  })
