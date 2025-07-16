import express from 'express'
import { middlewares } from './middlewares/middlewares.js'
import { routes } from './routes/routes.js'
import { lastMiddlewares } from './middlewares/lastMiddlewares.js'
import { finalErrorHandler, notFoundHandler, setupGlobalErrorHandlers } from './middlewares/finalErrorHandler.js'
import { basicMiddlewares } from './middlewares/basicMiddlewares.js'
import { specs, swaggerUi, swaggerUiOptions } from './config/swagger.js'

export const backend = express()

// Настройка глобальных обработчиков ошибок
setupGlobalErrorHandlers()

backend.use(basicMiddlewares)

// Swagger API Documentation
backend.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions))

// Swagger JSON endpoint
backend.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(specs)
})

backend.use(middlewares)

backend.use(routes)

// Обработка несуществующих маршрутов (404)
backend.all('*', notFoundHandler)

// Логирование ошибок
backend.use(lastMiddlewares)

// Финальный обработчик ошибок (должен быть последним!)
backend.use(finalErrorHandler)