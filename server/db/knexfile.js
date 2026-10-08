import * as Path from 'node:path'
import * as URL from 'node:url'
import dotenv from 'dotenv'
const __filename = URL.fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

dotenv.config({ path: Path.join(__dirname, '../../.env') })

const shared = {
  client: 'pg',
  migrations: { directory: Path.join(__dirname, 'migrations') },
  seeds: { directory: Path.join(__dirname, 'seeds') },
}

const supabaseConnection = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
}

export default {
  development: { ...shared, connection: supabaseConnection },
  production: { ...shared, connection: supabaseConnection },
  test: {
    ...shared,
    connection: {
      connectionString: process.env.DATABASE_URL_TEST,
      ssl: { rejectUnauthorized: false },
    },
  },
}
