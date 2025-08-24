// lib/db.ts
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Supabase SSL
  },
  connectionTimeoutMillis: 5000,
})

export default pool
