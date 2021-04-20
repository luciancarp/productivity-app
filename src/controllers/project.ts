import ProjectService from '../services/project'
import { Request, Response } from 'express'
import { check, validationResult } from 'express-validator'

import User from '../models/User'

export const validationCreateProject = [
  check('title', 'Title is required').not().isEmpty(),
]

const getAllProjects = async (req: Request, res: Response, next: Function) => {
  try {
    const projects = await ProjectService.getAllProjects()
    if (!projects) {
      res.status(404).json('There are no projects published yet!')
    }
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

const getProjectById = async (req: Request, res: Response, next: Function) => {
  try {
    let id = req.params.id || ''
    const project = await ProjectService.getProjectbyId(id)
    res.json(project)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

const createProject = async (req: Request, res: Response, next: Function) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    //TODO create and use user service
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    const newProject = {
      title: req.body.title,
      user: user.id,
    }

    const createdProject = await ProjectService.createProject(newProject)
    res.status(201).json(createdProject)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

//TODO UpdateProject

//TODO verify user
const deleteProject = async (req: Request, res: Response, next: Function) => {
  try {
    const projectId = req.params.id
    const deleteResponse = await ProjectService.deleteProject(projectId)
    res.json(deleteResponse)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export default {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject,
}
