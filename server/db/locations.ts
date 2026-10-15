import connection from './connection.ts'
import type { LocationKind, StorageLocation } from '../../models/location.ts'

const DEFAULT_LOCATIONS: { name: string; kind: LocationKind }[] = [
  { name: 'Pantry', kind: 'pantry' },
  { name: 'Fridge', kind: 'fridge' },
  { name: 'Freezer', kind: 'freezer' },
]

// A row exactly as Postgres hands it back (snake_case, and a Date object)
interface LocationRow {
  id: number
  user_id: number
  name: string
  kind: LocationKind
  created_at: Date
}

// The conversion we planned in the types ticket: snake_case -> camelCase
function toLocation(row: LocationRow): StorageLocation {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    kind: row.kind,
    createdAt: row.created_at.toISOString(),
  }
}

export async function createDefaultLocations(
  userId: number,
  db = connection,
): Promise<StorageLocation[]> {
  await db('locations')
    .insert(DEFAULT_LOCATIONS.map((loc) => ({ ...loc, user_id: userId })))
    .onConflict(['user_id', 'name'])
    .ignore()

  const rows = await db('locations')
    .where({ user_id: userId })
    .whereIn(
      'name',
      DEFAULT_LOCATIONS.map((loc) => loc.name),
    )
    .orderBy('id')

  return rows.map(toLocation)
}
