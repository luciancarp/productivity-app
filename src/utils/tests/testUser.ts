import faker from 'faker'
import { Schema, Types } from 'mongoose'

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

  const user = await new User(userData).save()
  return user
}
