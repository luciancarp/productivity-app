import express from 'express'
const router = express.Router()

import auth from '../../utils/auth'
import UserController, {
  loginUserValidation,
  createUserValidation,
} from '../../controllers/user'

// @route  POST api/user
// @desc   Register user
// @access Public
router.post('/', createUserValidation, UserController.createUser)

// @route  POST api/user/login
// @desc   Authenticate user and get token
// @access Public
router.post('/login', loginUserValidation, UserController.loginUser)

// @route  GET api/user/
// @desc   Get user
// @access Private
router.get('/', auth, UserController.getUser)

module.exports = router
