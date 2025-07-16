import { query } from "../db/connection.js"

class UsersTable {
    getById = async (id) => {
        const user = await query('SELECT * FROM users WHERE id = $1', [id])
        return user.rows[0]
    }

    getByTelegramId = async (telegramId) => {
        const user = await query('SELECT * FROM users WHERE telegram_id = $1', [telegramId])
        return user.rows[0]
    }
}

export const usersTable = new UsersTable()