import Router from 'express'
import { basicRoutes } from './basicRoutes.js'
import { applications } from './applicationsRoutes.js'
import { users } from './usersRoutes.js'
import { rates } from './ratesRoutes.js'

export const routes = new Router()

routes.use('/api/v1', basicRoutes)
routes.use('/api/v1/applications', applications)
routes.use('/api/v1/users', users)
routes.use('/api/v1/rates', rates)