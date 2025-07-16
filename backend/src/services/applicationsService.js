import { buyUsdtApplicationTable } from '../db/buyUsdtApplicationTable.js'
import { sellUsdtApplicationsTable } from '../db/sellUsdtApplicationsTable.js'
import { isValidApplicationId, isValidUserId } from '../utils/idChecker.js'
import { createApplicationId } from '../utils/idGenerator.js'
import { ValidationError, NotFoundError } from '../utils/errors.js'
import { getUsdtRubSellRate, getUsdtRubBuyRate } from '../api/api.js'
import { isTRC20Address } from '../utils/blockchainAddressChecker.js'
import { getUsdtByRubAmount, getRubByUsdtAmount } from '../utils/getCurrencyAmount.js'
import { TRC20 } from '../config/crypto.js'

class ApplicationsService {
    constructor() {
        this.buyUsdtTable = buyUsdtApplicationTable
        this.sellUsdtTable = sellUsdtApplicationsTable
    }

    async getById(id) {

        if(!isValidApplicationId(id)) {
            throw new ValidationError('Invalid application ID')
        }

        const buyApplication = await this.buyUsdtTable.getById(id)

        if(buyApplication) {
            return buyApplication
        }

        const sellApplication = await this.sellUsdtTable.getById(id)

        if(sellApplication) {
            return sellApplication
        }

        throw new NotFoundError('Application not found')
    }

    async create(application) {
        if(!application || typeof application !== 'object') {
            throw new ValidationError('Application is required and must be an object')
        }

        if(Object.keys(application).length === 0) {
            throw new ValidationError('Application cannot be empty')
        }

        const commonRequiredFields = ['blockchain', 'first_name', 'last_name', 'user_id']
        
        for(const field of commonRequiredFields) {
            if(!application[field]) {
                throw new ValidationError(`Missing required field: ${field}`)
            }
        }

        if(application.type === 'buy') {
            if(!isTRC20Address(application.crypto_address)) {
                throw new ValidationError('Invalid crypto address')
            }
        }
     
        const applicationWithId = {
            ...application,
            id: createApplicationId(),
            status: 'new',
        }

        let newApplication

        if(application.type === 'buy') {
            applicationWithId.buy_amount = await getUsdtByRubAmount(Number(application.sell_amount))
            applicationWithId.creation_usdt_rub_rate = await getUsdtRubSellRate()
            newApplication = await this.buyUsdtTable.create(applicationWithId)
        } else if(application.type === 'sell') {

            // ИЗМЕНИТЬ В БУДУЩЕМ РАПИРА АПИ
            applicationWithId.crypto_address = TRC20.address


            applicationWithId.buy_amount = await getRubByUsdtAmount(Number(application.sell_amount))
            applicationWithId.creation_usdt_rub_rate = await getUsdtRubBuyRate()
            newApplication = await this.sellUsdtTable.create(applicationWithId)
        } else {
            throw new ValidationError('Invalid application type')
        }
        
        return newApplication
    } 

    async getByUserId(userId, filters = {}) {

        if(!isValidUserId(userId)) {
            throw new ValidationError('Invalid user ID')
        }

        const {type, status} = filters
        let applications = []

        if(type && !['buy', 'sell'].includes(type)) {
            throw new ValidationError('Invalid type filter. Must be "buy" or "sell"')
        }

        if(status && !['new', 'in_process', 'completed', 'rejected'].includes(status)) {
            throw new ValidationError('Invalid status filter. Must be "new", "in_process", "completed" or "rejected"')
        }

        if(!type || type === 'buy') {
            if(status) {
                const buyUsdtApplications = await this.buyUsdtTable.getByUserIdAndStatus(userId, status)
                applications.push(...buyUsdtApplications)
            } else {
                const buyUsdtApplications = await this.buyUsdtTable.getByUserId(userId)
                applications.push(...buyUsdtApplications)
            }
        }

        if(!type || type === 'sell') {
            if(status) {
                const sellUsdtApplications = await this.sellUsdtTable.getByUserIdAndStatus(userId, status)
                applications.push(...sellUsdtApplications)
            } else {
                const sellUsdtApplications = await this.sellUsdtTable.getByUserId(userId)
                applications.push(...sellUsdtApplications)
            }
        }

        return applications
    }
}

export const applicationsService = new ApplicationsService()