import { Router } from 'express'
import tasksRoutes from './tasksRoutes'
import authRoutes from './authRoutes'
import tokenValidator from '../middlewares/tokenValidaton'

const apiRoutes = Router()

apiRoutes.use('/task', tokenValidator(), tasksRoutes)
apiRoutes.use('/auth', authRoutes)

export default apiRoutes
