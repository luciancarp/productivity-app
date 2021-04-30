import { Request, Response } from 'express'
import { check, validationResult } from 'express-validator'

import ProjectService from '../services/project'

export const validationCreateProject = [
  check('title', 'Title is required').not().isEmpty(),
]

const createProject = async (req: Request, res: Response, next: Function) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const newProject = {
      title: req.body.title,
      user: req.user.id,
    }

    const createdProject = await ProjectService.createProject(newProject)
    res.status(201).json(createdProject)
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

const getProject = async (req: Request, res: Response, next: Function) => {
  try {
    let id = req.params.id
    const project = await ProjectService.getProject(id)

    if (!project) {
      return res.status(400).json({ errors: [{ msg: 'Project not found' }] })
    }

    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

//TODO updateProject

const deleteProject = async (req: Request, res: Response, next: Function) => {
  try {
    const projectId = req.params.id

    const project = await ProjectService.getProject(projectId)

    if (!project) {
      return res.status(400).json({ errors: [{ msg: 'Project not found' }] })
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ errors: [{ msg: 'User not authorized' }] })
    }

    const deletedProject = await ProjectService.deleteProject(projectId)

    res.status(200).json(deletedProject)
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

const getUserProjects = async (req: Request, res: Response, next: Function) => {
  try {
    const projects = await ProjectService.getUserProjects(req.user.id)

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

export default {
  createProject,
  getProject,
  deleteProject,
  getUserProjects,
}
