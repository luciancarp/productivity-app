import express, { Request, Response } from 'express'
const router = express.Router()
import { check, validationResult } from 'express-validator'
import auth from '../../middleware/auth'

import ProjectCtrl from '../../controllers/project.controller'

// @route  POST api/projects
// @desc   Create project
// @access Private
router.post(
  '/',
  auth,
  [check('title', 'Title is required').not().isEmpty()],
  ProjectCtrl.apiCreateProject
)

//TODO Change to private

// @route    GET api/project/:id
// @desc     Get project by ID
// @access   Public
router.get('/:id', ProjectCtrl.apiGetProjectById)

module.exports = router
