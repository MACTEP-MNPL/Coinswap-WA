import { Router } from 'express'
import { usersController } from '../controllers/usersController.js'

export const users = new Router()

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user by their unique user ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: "A1B2C3D4"
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             example:
 *               id: "A1B2C3D4"
 *               telegram_id: "123456789"
 *               first_name: "John"
 *               last_name: "Doe"
 */
users.get('/:id', usersController.getById)

/**
 * @swagger
 * /users/telegram_id/{id}:
 *   get:
 *     summary: Get user by Telegram ID
 *     description: Retrieve a user by their Telegram user ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Telegram user ID
 *         schema:
 *           type: string
 *           example: "123456789"
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             example:
 *               id: "A1B2C3D4"
 *               telegram_id: "123456789"
 *               first_name: "John"
 *               last_name: "Doe"
 */
users.get('/telegram_id/:id', usersController.getByTelegramId)
