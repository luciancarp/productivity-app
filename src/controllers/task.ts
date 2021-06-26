import { Request, Response } from 'express'
import { check, validationResult } from 'express-validator'

import ProjectService from '../services/project'
import TaskService from '../services/task'

export const validationCreateTask = [
  check('title', 'Title is required').not().isEmpty(),
  check('project', 'Project is required').not().isEmpty(),
  check('time', 'Time is required').not().isEmpty(),
]

const createTask = async (req: Request, res: Response, next: Function) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const projectId = req.body.project

    const project = await ProjectService.getProject(projectId)

    if (!project) {
      return res.status(400).json({ errors: [{ msg: 'Project not found' }] })
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ errors: [{ msg: 'User not authorized' }] })
    }

    const newTask = {
      title: req.body.title,
      project: req.body.project,
      time: req.body.time,
    }

    const createdTask = await TaskService.createTask(newTask)
    res.status(201).json(createdTask)
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

const deleteTask = async (req: Request, res: Response, next: Function) => {
  try {
    const taskId = req.params.id

    const task = await TaskService.getTask(taskId)

    if (!task) {
      return res.status(400).json({ errors: [{ msg: 'Task not found' }] })
    }

    const projectId = task.project.toString()

    const project = await ProjectService.getProject(projectId)

    if (!project) {
      return res.status(400).json({ errors: [{ msg: 'Project not found' }] })
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ errors: [{ msg: 'User not authorized' }] })
    }

    const deletedTask = await TaskService.deleteTask(taskId)

    res.status(200).json(deletedTask)
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

const getProjectTasks = async (req: Request, res: Response, next: Function) => {
  try {
    const projectId = req.params.id

    const project = await ProjectService.getProject(projectId)

    if (!project) {
      return res.status(400).json({ errors: [{ msg: 'Project not found' }] })
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ errors: [{ msg: 'User not authorized' }] })
    }

    const tasks = await TaskService.getProjectTasks(projectId)

    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

export default {
  createTask,
  deleteTask,
  getProjectTasks,
}
