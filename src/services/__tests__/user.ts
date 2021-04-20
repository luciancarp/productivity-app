import { Types } from 'mongoose'
import User from '../../models/User'
import UserService from '../user'
import bcrypt from 'bcryptjs'

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when creating a user', () => {
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
