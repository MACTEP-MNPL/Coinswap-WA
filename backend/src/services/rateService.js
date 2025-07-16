import {getUsdtRubBuyRate, getUsdtRubSellRate} from "../api/api.js"


class RateService {
    async getUsdtRub() {
        return {
            buy_rate: await getUsdtRubBuyRate(),
            sell_rate: await getUsdtRubSellRate()
        }
    }
}

export const rateService = new RateService()