import { Types } from 'mongoose'
import User from '../../models/User'
import UserService from '../user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { mockUser } from '../../utils/tests/testUser'

describe('UserService', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('createUser', () => {
    const { name, email, password } = mockUser
    it('creates a user', async () => {
      User.prototype.save = jest
        .fn()
        .mockResolvedValue({ name, email, password })

      const response = await UserService.createUser({ name, email, password })

      expect(response.toString()).toMatch(/^[0-9a-fA-F]{24}$/)
    })

    it('generates salt', async () => {
      const spy = jest.spyOn(bcrypt, 'genSalt')

      await UserService.createUser({ name, email, password })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(10)
    })

    it('hashes password', async () => {
      const mockSalt = '$2a$10$xOSv6opu8HKptJDDY2R1m.'
      const spy = jest.spyOn(bcrypt, 'hash')

      bcrypt.genSalt = jest.fn().mockReturnValue(mockSalt)

      await UserService.createUser(mockUser)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(mockUser.password, mockSalt)
    })
  })

  describe('getUserById', () => {
    const { id, name, email } = mockUser
    it('fetches a user by id', async () => {
      User.findById = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockResolvedValueOnce(mockUser),
      }))

      const fetchedUser = await UserService.getUserById(id)

      if (!fetchedUser) {
        throw new Error('User is null')
      }

      expect(fetchedUser.name).toEqual(name)
      expect(fetchedUser.email).toEqual(email)
      expect(User.findById).toHaveBeenCalledWith(id)
    })
  })

  describe('getUserByEmail', () => {
    it('fetches a user by email', async () => {
      const { name, email } = mockUser

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockResolvedValueOnce(mockUser),
      }))

      const fetchedUser = await UserService.getUserByEmail(email)

      if (!fetchedUser) {
        throw new Error('User is null')
      }

      expect(fetchedUser.name).toEqual(name)
      expect(fetchedUser.email).toEqual(email)
      expect(User.findOne).toHaveBeenCalledWith({ email })
    })
  })

  describe('updateUser', () => {
    const { id } = mockUser
    it('updates a user', () => {
      const mockUpdate = {
        name: 'test1',
        email: 'test@test.com',
        password: 'test',
      }

      const mockUpdatedUser = {
        id,
        ...mockUpdate,
      }

      const spy = jest
        .spyOn(User, 'findOneAndUpdate')
        .mockReturnValueOnce(mockUpdatedUser as any)

      UserService.updateUser(id, mockUpdate)

      const spyUpdatedUser = spy.mock.results[0].value

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spyUpdatedUser).toEqual(mockUpdatedUser)
      expect(spy).toHaveBeenCalledWith({ _id: id }, { ...mockUpdate })
    })
  })

  describe('deleteUser', () => {
    const { id, name, email, password } = mockUser
    it('deletes a user', () => {
      const spy = jest
        .spyOn(User, 'findOneAndDelete')
        .mockReturnValueOnce({ id, name, email, password } as any)

      UserService.deleteUser(id)

      const spyDeletedUser = spy.mock.results[0].value

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spyDeletedUser).toEqual({ id, name, email, password })
    })
  })

  describe('createAuthToken', () => {
    const { id } = mockUser
    it('creates a token', async () => {
      const token = await UserService.createAuthToken(id)

      if (!token) {
        throw new Error('Token is null')
      }

      let errorToken
      let decodedToken: any
      jwt.verify(token, process.env.JWT_SECRET || '', (error, decoded) => {
        errorToken = error
        decodedToken = decoded
      })

      expect(errorToken).toBeNull()
      expect(decodedToken).toBeTruthy()
      expect(decodedToken.user.id).toEqual(id)
    })
  })

  describe('loginUser', () => {
    const { id, name, email, password } = mockUser

    const mockLogin = {
      email,
      password,
    }

    it('fetches user by email', async () => {
      const spy = jest
        .spyOn(User, 'findOne')
        .mockReturnValue({ id, name, email, password } as any)
      bcrypt.compare = jest.fn().mockReturnValue(true)

      await UserService.loginUser(mockLogin.email, mockLogin.password)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith({ email })
    })

    it('compares given password with stored hash', async () => {
      const spy = jest.spyOn(bcrypt, 'compare').mockReturnValue(true as any)

      User.findOne = jest.fn().mockReturnValue({ id, name, email, password })

      await UserService.loginUser(mockLogin.email, mockLogin.password)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(mockLogin.password, password)
    })

    it('returns token', async () => {
      User.findOne = jest.fn().mockReturnValue({ id, name, email, password })
      bcrypt.compare = jest.fn().mockReturnValue(true)

      const token = await UserService.loginUser(
        mockLogin.email,
        mockLogin.password
      )

      if (!token) {
        throw new Error('Token is null')
      }

      expect(token).toBeTruthy()
    })
  })
})
