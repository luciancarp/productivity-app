import faker from 'faker'
import { Types } from 'mongoose'
import UserService from '../../services/user'

import User from '../../models/User'

type TestUserType = {
  id: string
  name: string
  email: string
  password: string
}

export const mockUser: TestUserType = {
  id: Types.ObjectId().toString(),
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}

export const testUser = async () => {
  const userData = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }

  // const user = await new User(userData).save()
  const createdUserId = await UserService.createUser(userData)

  const user = await User.findById(createdUserId.toString())

  if (!user) throw new Error('User not found')

  return { user, password: userData.password }
}

export const authorizedTestUser = async () => {
  const { user, password } = await testUser()

  const token = await UserService.createAuthToken(user._id)

  return { user, token }
}
