import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import UserService from '../../services/user'
import auth from '../auth'

describe('Auth middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()

    mockRequest = {}
    mockResponse = {
      status: jest.fn(),
      json: jest.fn(),
    }
  })

  describe('given a valid token', () => {
    it('adds the user id to request', async () => {
      const mockId = Types.ObjectId()

      const token = await UserService.createAuthToken(mockId.toString())

      if (!token) {
        throw new Error('Token is undefined')
      }

      mockRequest = {
        headers: {
          'x-auth-token': token,
        },
      }

      mockRequest.header = jest.fn().mockReturnValue(token)

      await auth(mockRequest as Request, mockResponse as Response, nextFunction)

      if (!mockRequest.user) {
        throw new Error('mock request user is undefined')
      }

      expect(mockRequest.user.id).toEqual(mockId.toString())
    })
  })

  describe('given an invalid token', () => {
    it('returns 401 error', async () => {
      const mockInvalidToken = 'test'

      mockRequest = {
        headers: {
          'x-auth-token': mockInvalidToken,
        },
      }

      const json = { errors: [{ msg: 'Token is not valid' }] }

      mockRequest.header = jest.fn().mockReturnValue(mockInvalidToken)

      await auth(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith(json)
    })
  })

  describe('given no token', () => {
    it('returns 401 error', async () => {
      mockRequest = {
        headers: {
          'x-auth-token': undefined,
        },
      }

      const json = { errors: [{ msg: 'No token, authorization denied' }] }

      mockRequest.header = jest.fn().mockReturnValue(undefined)

      await auth(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toBeCalledWith(401)
      expect(mockResponse.json).toBeCalledWith(json)
    })
  })
})
