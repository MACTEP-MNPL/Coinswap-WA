import { DATABASE_HOST, DATABASE_PORT, DATABASE_DB, DATABASE_USER, DATABASE_PASSWORD } from '../utils/envVariables.js'

export const dbConfig = {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    database: DATABASE_DB,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    connectionTimeoutMillis: 2000,
  }