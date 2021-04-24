import UserService from '../services/user'
import { Request, Response } from 'express'
import { check, validationResult } from 'express-validator'

export const createUserValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
]

export const loginUserValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists().notEmpty(),
]

const createUser = async (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }

  try {
    const user = await UserService.getUserByEmail(newUserData.email)

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }

    const newUser = await UserService.createUser(newUserData)
    return res.status(201).json({ id: newUser._id })
  } catch (error) {
    console.log(error)
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

const getUser = async (req: Request, res: Response, next: Function) => {
  try {
    const user = await UserService.getUserById(req.user.id)

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User not found' }] })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

const loginUser = async (req: Request, res: Response, next: Function) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const token = await UserService.loginUser(email, password)

    return res.status(200).json({ token: token })
  } catch (error) {
    if (error.message === 'Invalid Credentials')
      res.status(400).json({ errors: [{ msg: 'Incorrect email or password' }] })
    else res.status(500).send({ errors: [{ msg: 'Server error' }] })
  }
}

export default {
  createUser,
  getUser,
  loginUser,
}
