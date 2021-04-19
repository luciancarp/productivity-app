import { Types } from 'mongoose'
import User from '../../models/User'
import UserService from '../user'

describe('User Service', () => {
  it('creates a user', () => {
    const mockUser = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    }

    const spy = jest.spyOn(User.prototype, 'save').mockReturnValueOnce(mockUser)

    UserService.createUser(mockUser)

    const spyCreatedUser = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyCreatedUser.email).toEqual(mockUser.email)

    spy.mockReset()
  })

  it('fetches a user by id', () => {
    const mockUser = {
      _id: Types.ObjectId(),
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    }

    const spy = jest
      .spyOn(User, 'findById')
      .mockReturnValueOnce(mockUser as any)

    UserService.getUserById(mockUser._id.toString())

    const spyFetchedUser = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyFetchedUser).toEqual(mockUser)

    spy.mockReset()
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

    spy.mockReset()
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
