import Router from 'express'
import { applicationsController } from '../controllers/applicationsController.js'

export const applications = new Router()

/**
 * @swagger
 * /applications/user/{userId}:
 *   get:
 *     summary: Get applications by user ID
 *     description: Retrieve all applications for a specific user
 *     tags: [Applications]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: "A1B2C3D4"
 *       - name: type
 *         in: query
 *         required: false
 *         description: Filter by application type
 *         schema:
 *           type: string
 *           enum: [buy, sell]
 *       - name: status
 *         in: query
 *         required: false
 *         description: Filter by application status
 *         schema:
 *           type: string
 *           enum: [new, in_process, completed, rejected]
 *     responses:
 *       200:
 *         description: Applications list
 *         content:
 *           application/json:
 *             example:
 *               - id: "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 *                 type: "buy"
 *                 status: "new"
 *                 blockchain: "trc20"
 *                 sell_amount: 10000
 *                 buy_amount: 104.71
 *                 first_name: "John"
 *                 last_name: "Doe"
 *                 user_id: "A1B2C3D4"
 */
// Query params: ?type=buy|sell&status=pending|completed|rejected
applications.get('/user/:userId', applicationsController.getByUserId)

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     description: Retrieve a specific application by its ID
 *     tags: [Applications]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: string
 *           example: "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 *     responses:
 *       200:
 *         description: Application data
 *         content:
 *           application/json:
 *             example:
 *               id: "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 *               type: "buy"
 *               status: "new"
 *               blockchain: "trc20"
 *               sell_amount: 10000
 *               buy_amount: 104.71
 *               crypto_address: "TQrZ8tVHjVGa2KqKqpQjgVx6TvQ8XrYQFG"
 *               first_name: "John"
 *               last_name: "Doe"
 *               user_id: "A1B2C3D4"
 */
applications.get('/:id', applicationsController.getById)

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create new application
 *     description: Create a new cryptocurrency exchange application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             buy_application:
 *               summary: Create buy application
 *               value:
 *                 type: "buy"
 *                 blockchain: "trc20"
 *                 sell_amount: 100000
 *                 sell_currency: "RUB"
 *                 crypto_address: "TQrZ8tVHjVGa2KqKqpQjgVx6TvQ8XrYQFG"
 *                 first_name: "John"
 *                 last_name: "Doe"
 *                 user_id: "A1B2C3D4"
 *             sell_application:
 *               summary: Create sell application
 *               value:
 *                 type: "sell"
 *                 blockchain: "trc20"
 *                 sell_amount: 100
 *                 first_name: "Jane"
 *                 last_name: "Smith"
 *                 user_id: "B2C3D4E5"
 *     responses:
 *       201:
 *         description: Application created
 *         content:
 *           application/json:
 *             example:
 *               id: "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 *               type: "buy"
 *               status: "new"
 *               blockchain: "trc20"
 *               sell_amount: 100000
 *               buy_amount: 1047.1
 *               crypto_address: "TQrZ8tVHjVGa2KqKqpQjgVx6TvQ8XrYQFG"
 *               first_name: "John"
 *               last_name: "Doe"
 *               user_id: "A1B2C3D4"
 */
applications.post('/', applicationsController.create)

