import dotenv from 'dotenv'

dotenv.config()

export const {PORT, DATABASE_HOST, DATABASE_PORT, DATABASE_DB, DATABASE_USER, DATABASE_PASSWORD} = process.env

