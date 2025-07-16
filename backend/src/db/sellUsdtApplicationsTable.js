import { query } from './connection.js'
import { getSqlQueryByData } from '../utils/getSqlQueryByData.js'

class SellUsdtApplicationsTable {
    constructor() {
        this.table = 'sell_usdt_applications'
        this.columns = new Set(['id', 'status', 'type', 'buy_currency', 'buy_amount', 'sell_amount', 'blockchain', 'crypto_address', 'first_name', 'last_name', 'patronymic', 'creation_usdt_rub_rate', 'user_id'])
    }

    async getById(id) {
        const application = await query('SELECT * FROM sell_usdt_applications WHERE id = $1', [id])
        return application.rows[0]
    }

    async create(application) {
        const { sql, values } = getSqlQueryByData(application, this.columns)
        const sqlQuery = `INSERT INTO sell_usdt_applications ${sql} RETURNING *`
        const newApplication = await query(sqlQuery, values)
        return newApplication.rows[0]
    }

    async getByUserId(userId) {
        const applications = await query('SELECT * FROM sell_usdt_applications WHERE user_id = $1', [userId])
        return applications.rows
    }

    async getByUserIdAndStatus(userId, status) {
        const applications = await query('SELECT * FROM sell_usdt_applications WHERE user_id = $1 AND status = $2', [userId, status])
        return applications.rows
    }
}

export const sellUsdtApplicationsTable = new SellUsdtApplicationsTable()