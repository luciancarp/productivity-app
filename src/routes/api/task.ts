import express from 'express'
const router = express.Router()

import auth from '../../utils/auth'
import TaskController, { validationCreateTask } from '../../controllers/task'

// @route    GET api/task/project/:id
// @desc     Get project's tasks
// @access   Private
router.get('/project/:id', auth, TaskController.getProjectTasks)

// @route  POST api/task
// @desc   Create task
// @access Private
router.post('/', auth, validationCreateTask, TaskController.createTask)

// @route    DELETE api/task/:id
// @desc     Delete task by ID
// @access   Private
router.delete('/:id', auth, TaskController.deleteTask)

module.exports = router
