import { usersService } from "../services/usersService.js"
import { asyncHandler } from "../utils/asyncHandler.js"

class UsersController {
    getById = asyncHandler(async (req, res) => {
        const {id} = req.params
        const user = await usersService.getById(id)
        res.json(user)
    })

    getByTelegramId = asyncHandler(async (req, res) => {
        const {id} = req.params
        const user = await usersService.getByTelegramId(id)
        res.json(user)
    })
}

export const usersController = new UsersController()