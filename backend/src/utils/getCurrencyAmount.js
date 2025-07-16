import { getUsdtRubSellRate, getUsdtRubBuyRate } from '../api/api.js'
import { ExternalServiceError } from './errors.js'

export const getRubByUsdtAmount = async (amount) => {

    if(typeof amount !== 'number') {
        throw new ExternalServiceError('getRubUsdtRate', 'Amount must be a number')
    }

    if(amount <= 0) {
        throw new ExternalServiceError('getRubUsdtRate', 'Amount must be greater than 0')
    }

    const usdtRubRate = await getUsdtRubBuyRate()
    return amount * usdtRubRate
}

export const getUsdtByRubAmount = async (amount) => {

    if(typeof amount !== 'number') {
        throw new ExternalServiceError('getRubUsdtRate', 'Amount must be a number')
    }

    if(amount <= 0) {
        throw new ExternalServiceError('getRubUsdtRate', 'Amount must be greater than 0')
    }

    const rubUsdtRate = await getUsdtRubSellRate()
    return amount / rubUsdtRate
}