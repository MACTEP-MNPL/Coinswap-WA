import { backend } from './server.js'
import { testConnection } from './db/connection.js'
import { PORT } from './utils/envVariables.js'
import { log } from './logger/log.js'
import { logAllEnvVariables } from './logger/logFunctions.js' 

logAllEnvVariables()

backend.listen(PORT, async () => {
  log.info(`🚀 Server running on port ${PORT}`)
  log.info(`📱 API available at http://localhost:${PORT}/api/v1`)
  log.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
  log.info(`🔍 Health check: http://localhost:${PORT}/api/v1/health`)
  
  const dbConnected = await testConnection()
  if (dbConnected) {
    log.info('✅ Database connection established')
  } else {
    log.error('❌ Database connection failed')
  }
})
