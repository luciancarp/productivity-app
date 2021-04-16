import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const auth = async function (req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header('x-auth-token')

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  // Verify token
  try {
    await jwt.verify(token, process.env.JWT_SECRET || '', (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: 'Token is not valid' })
      } else {
        req.user = (<any>decoded).user
        next()
      }
    })
  } catch (err) {
    console.error('something wrong with auth middleware')
    res.status(500).json({ msg: 'Server Error' })
  }
}

export default auth
