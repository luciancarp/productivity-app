import { Types } from 'mongoose'
import User from '../../models/User'
import UserService from '../user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    const mockUser = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    }
    const mockSalt = 'salt'
    const mockHash = 'hash'

    User.prototype.save = jest.fn().mockResolvedValue(mockUser)

    const spyBcryptGenSalt = jest
      .spyOn(bcrypt, 'genSalt')
      .mockReturnValue(mockSalt as any)

    const spyBcryptHash = jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValue(mockHash as any)

    it('creates a user', async () => {
      const response = await UserService.createUser(mockUser)

      expect(response.toString()).toMatch(/^[0-9a-fA-F]{24}$/)
    })

    it('generates salt', async () => {
      await UserService.createUser(mockUser)

      const spySalt = spyBcryptGenSalt.mock.results[0].value

      expect(spyBcryptGenSalt).toHaveBeenCalledTimes(1)
      expect(spySalt).toEqual(mockSalt)
    })

    it('hashes password', async () => {
      await UserService.createUser(mockUser)

      const spyHash = spyBcryptHash.mock.results[0].value

      expect(spyBcryptHash).toHaveBeenCalledTimes(1)
      expect(spyHash).toEqual(mockHash)
    })
  })

  describe('getUserById', () => {
    it('fetches a user by id', async () => {
      const mockFetchedUser = {
        _id: Types.ObjectId(),
        name: 'test',
        email: 'test@test.com',
      }

      User.findById = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockResolvedValueOnce(mockFetchedUser),
      }))

      const fetchedUser = await UserService.getUserById(
        mockFetchedUser._id.toString()
      )

      if (!fetchedUser) {
        throw new Error('User is null')
      }

      expect(fetchedUser.name).toEqual(mockFetchedUser.name)
      expect(fetchedUser.email).toEqual(mockFetchedUser.email)
    })
  })

  describe('getUserByEmail', () => {
    it('fetches a user by email', async () => {
      const mockUser = {
        _id: Types.ObjectId(),
        name: 'test',
        email: 'test@test.com',
      }

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockResolvedValueOnce(mockUser),
      }))

      const fetchedUser = await UserService.getUserByEmail(mockUser.email)

      if (!fetchedUser) {
        throw new Error('User is null')
      }

      expect(fetchedUser.name).toEqual(mockUser.name)
      expect(fetchedUser.email).toEqual(mockUser.email)
    })
  })

  describe('updateUser', () => {
    it('updates a user', () => {
      const mockUser = {
        _id: Types.ObjectId(),
        name: 'test0',
        email: 'test@test.com',
        password: 'test',
      }

      const mockUpdatedUser = {
        _id: mockUser._id,
        name: 'test1',
        email: 'test@test.com',
        password: 'test',
      }

      const mockUpdate = {
        name: 'test1',
        email: 'test@test.com',
        password: 'test',
      }

      const spy = jest
        .spyOn(User, 'findOneAndUpdate')
        .mockReturnValueOnce(mockUpdatedUser as any)

      UserService.updateUser(mockUser._id.toString(), mockUpdate)

      const spyUpdatedUser = spy.mock.results[0].value

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spyUpdatedUser).toEqual(mockUpdatedUser)
    })
  })

  describe('deleteUser', () => {
    it('deletes a user', () => {
      const mockUser = {
        _id: Types.ObjectId(),
        name: 'test',
        email: 'test@test.com',
        password: 'test',
      }

      const spy = jest
        .spyOn(User, 'findOneAndDelete')
        .mockReturnValueOnce(mockUser as any)

      UserService.deleteUser(mockUser._id.toString())

      const spyDeletedUser = spy.mock.results[0].value

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spyDeletedUser).toEqual(mockUser)
    })
  })

  describe('createAuthToken', () => {
    it('creates a token', async () => {
      const mockId = Types.ObjectId()

      const token = await UserService.createAuthToken(mockId.toString())

      if (!token) {
        throw new Error('Token is null')
      }

      let errorToken
      let decodedToken
      jwt.verify(token, process.env.JWT_SECRET || '', (error, decoded) => {
        errorToken = error
        decodedToken = decoded
      })

      expect(errorToken).toBeNull()
      expect(decodedToken).toBeTruthy()
    })
  })

  describe('loginUser', () => {
    const mockLogin = {
      email: 'test@test.com',
      password: 'test',
    }

    const mockUser = {
      _id: Types.ObjectId(),
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    }

    it('fetches user by email', async () => {
      const spy = jest.spyOn(User, 'findOne').mockReturnValue(mockUser as any)

      await UserService.loginUser(mockLogin.email, mockLogin.password)

      const spyFetchedUser = spy.mock.results[0].value

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spyFetchedUser.email).toEqual(mockUser.email)
    })

    it('compares given password with stored hash', async () => {
      const spy = jest.spyOn(bcrypt, 'compare').mockReturnValue(true as any)

      await UserService.loginUser(mockLogin.email, mockLogin.password)

      const spyIsMatch = spy.mock.results[0].value

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spyIsMatch).toBeTruthy()
    })

    it('returns token', async () => {
      const token = await UserService.loginUser(
        mockLogin.email,
        mockLogin.password
      )

      if (!token) {
        throw new Error('Token is null')
      }

      let errorToken
      let decodedToken
      jwt.verify(token, process.env.JWT_SECRET || '', (error, decoded) => {
        errorToken = error
        decodedToken = decoded
      })

      expect(errorToken).toBeNull()
      expect(decodedToken).toBeTruthy()
    })
  })
})
