import type { Request, Response } from "express"
import type { CreateTaskDTO, UpdateTaskDTO } from "../models/dto/TaskDTO"
import { UserTokenPayload } from "../models/dto/UserDTO"
import TaskRepository from "../models/repositories/TaskRepository"
import { createTaskSchema, updateTaskSchema } from "../models/validators/taskSchemas"

// Mensajes de error predefinidos
const TASK_EXISTS = 'Task already exists'
const WENT_WRONG = 'Something went wrong'

export default class TasksController {
  public readonly getAll = async (req: Request, res: Response) => {
    try{
      const user = req.user as UserTokenPayload
      const repository = new TaskRepository(user.sub)
      const task = await repository.findAll()
      res.json(task)
    }catch(error) {
      console.log(error.message)
      res.status(500).json({ message: WENT_WRONG })
    }
  }

  public readonly getById = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user as UserTokenPayload

    const repository = new TaskRepository(user.sub)

    const task = await repository.getById(parseInt(id))

    res.json(task)
  }

  public readonly create = async (req: Request, res: Response) => {
    const task: CreateTaskDTO = req.body

    try{
      await createTaskSchema.validateAsync(task)
    }catch (error){
      res.status(400).json({ message: error.message})
      return
    }

    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)
    try {
      const newTask = await repository.create(task)
      res.json(newTask)
    } catch (error) {
      if (error.code = 'P2002') {
        res.status(409).json({ message:  TASK_EXISTS})
        return
      }
      console.log(error)
      res.status(500).json({ message:  WENT_WRONG})
    }

  }

  public readonly update = async (req: Request, res: Response) => {
    const { id } = req.params
    const task = req.body as UpdateTaskDTO
    
    try{
      await updateTaskSchema.validateAsync(task)
    }catch (error){
      res.status(400).json({ message: error.message})
    }
    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)

    try{
      await repository.update(parseInt(id), task)
      res.sendStatus(204)
    }catch (error) {
      if (error.code = 'P2002') {
        res.status(409).json({ message:  TASK_EXISTS})
        return
      }
      res.status(500).json({ message:  WENT_WRONG})
    }
    
  }

  public readonly delete = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)
    try{
      await repository.delete(parseInt(id))
      res.sendStatus(204)
    }catch (error) {
      if (error.code = 'P2002') {
          res.status(409).json({ message:  TASK_EXISTS})
          return
      }
      res.status(500).json({ message:  WENT_WRONG})
    }
  }
}
