import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const auth = async function (req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header('x-auth-token')

  // Check if no token
  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: 'No token, authorization denied' }] })
  }

  // Verify token
  try {
    jwt.verify(token, process.env.JWT_SECRET || '', (error, decoded) => {
      if (error) {
        res.status(401).json({ errors: [{ msg: 'Token is not valid' }] })
      } else {
        req.user = (<any>decoded).user
        next()
      }
    })
  } catch (error) {
    console.error(`Could not verify token => ${error}`)
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

export default auth
