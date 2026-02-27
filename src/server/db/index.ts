import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const conn = process.env.DATABASE_URL!
export const db = drizzle(conn, { schema })
