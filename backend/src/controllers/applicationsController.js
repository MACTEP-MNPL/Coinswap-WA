import { asyncHandler } from '../utils/asyncHandler.js';
import { applicationsService } from '../services/applicationsService.js';

class ApplicationsController {

    getById = asyncHandler(async (req, res) => {
        const {id} = req.params
        const application = await applicationsService.getById(id)
        res.json(application)
    })

    create = asyncHandler(async (req, res) => {
        const application = req.body
        
        const newApplication = await applicationsService.create(application)
        res.status(201).json(newApplication)
    })

    getByUserId = asyncHandler(async (req, res) => {
        const {userId} = req.params
        const {type, status} = req.query
        const applications = await applicationsService.getByUserId(userId, {type, status})
        res.json(applications)
    })
}

export const applicationsController = new ApplicationsController()