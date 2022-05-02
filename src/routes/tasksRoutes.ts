import { Router } from 'express'
import HealthController from '../controllers/TasksController'

const taskRoutes = Router()
const controller = new HealthController()

taskRoutes.get('/', controller.getAll) 
taskRoutes.get('/:id', controller.getById)
taskRoutes.post('/', controller.create)
taskRoutes.put('/:id', controller.update)
taskRoutes.delete('/:id', controller.delete)

export default taskRoutes
