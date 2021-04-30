import express from 'express'
const router = express.Router()

import auth from '../../utils/auth'
import ProjectController, {
  validationCreateProject,
} from '../../controllers/project'

// @route    GET api/project/user
// @desc     Get user's projects
// @access   Private
router.get('/user', auth, ProjectController.getUserProjects)

// @route  POST api/projects
// @desc   Create project
// @access Private
router.post('/', auth, validationCreateProject, ProjectController.createProject)

// @route    GET api/project/:id
// @desc     Get project by ID
// @access   Private
router.get('/:id', auth, ProjectController.getProject)

// @route    DELETE api/project/:id
// @desc     Delete project by ID
// @access   Private
router.delete('/:id', auth, ProjectController.deleteProject)

module.exports = router
