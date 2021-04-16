import express, { Request, Response } from 'express'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'

import User from '../../models/User'

// @route  POST api/users
// @desc   Register user
// @access Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
      }

      user = new User({
        name,
        email,
        password,
      })

      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save()

      //due to mongoose we can user user.id instead of user._id
      const payload = {
        user: {
          id: user.id,
        },
      }

      // 3600 = 1h
      jwt.sign(
        payload,
        process.env.JWT_SECRET || '',
        { expiresIn: 604800 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

module.exports = router
