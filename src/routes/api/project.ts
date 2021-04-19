import express from 'express'
const router = express.Router()

import auth from '../../utils/auth'
import ProjectController, {
  validationCreateProject,
} from '../../controllers/project'

// @route  POST api/projects
// @desc   Create project
// @access Private
router.post('/', auth, validationCreateProject, ProjectController.createProject)

//TODO Change to private

// @route    GET api/project/:id
// @desc     Get project by ID
// @access   Public
router.get('/:id', ProjectController.getProjectById)

module.exports = router
