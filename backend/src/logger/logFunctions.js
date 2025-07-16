import { log } from './log.js'
import { PORT, DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DB } from '../utils/envVariables.js'

export const logAllEnvVariables = () => {
  log.info(`BACKEND_PORT: ${PORT}`)
  log.info(`DATABASE_HOST: ${DATABASE_HOST}`)
  log.info(`DATABASE_PORT: ${DATABASE_PORT}`)
}