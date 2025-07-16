import { usersTable } from "../db/usersTable.js"
import { isValidUserId } from "../utils/idChecker.js"

class UsersService {
    getById = async (id) => {
        if(!isValidUserId(id)) {
            throw new Error('Invalid user id')
        }

        const user = await usersTable.getById(id)

        return user
    }

    getByTelegramId = async (telegramId) => {
        const user = await usersTable.getByTelegramId(telegramId)

        return user
    }
}

export const usersService = new UsersService()