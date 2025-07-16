import {rateService} from "../services/rateService.js"
import { asyncHandler } from "../utils/asyncHandler.js"


class RateController {

    getUsdtRub = asyncHandler(async (req, res) =>  {
        const rate = await rateService.getUsdtRub()

        res.json(rate)
    })
    
}

export const rateController = new RateController()