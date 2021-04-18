import express, { Request, Response } from 'express'
const router = express.Router()
import { check, validationResult } from 'express-validator'
import auth from '../../middleware/auth'

import Controller from '../../controllers/ProjectController'

// @route  POST api/projects
// @desc   Create project
// @access Private
router.post(
  '/',
  auth,
  Controller.validationCreateProject,
  Controller.apiCreateProject
)

//TODO Change to private

// @route    GET api/project/:id
// @desc     Get project by ID
// @access   Public
router.get('/:id', Controller.apiGetProjectById)

module.exports = router
