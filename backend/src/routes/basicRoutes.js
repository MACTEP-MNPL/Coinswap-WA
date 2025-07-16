import express from 'express'
import { testConnection } from '../db/connection.js'

const { Router } = express

export const basicRoutes = Router()

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current health status of the API service and database connection
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service status
 *         content:
 *           application/json:
 *             example:
 *               status: "healthy"
 *               database: "connected"
 *               uptime: 3600.123
 *               timestamp: "2024-01-15T10:30:00.000Z"
 */
basicRoutes.get('/health', async (req, res) => {
    try {
      const dbStatus = await testConnection()
      res.json({
        status: 'healthy',
        database: dbStatus ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        database: 'disconnected',
        uptime: process.uptime(),
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  })