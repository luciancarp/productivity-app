import faker from 'faker'

import User from '../../models/User'

type TestUserType = {
  name: string
  email: string
  password: string
}

export const testUser = () => {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}

export const createTestUser = async () => {
  const userData = testUser()

  const user = await new User(userData).save()
  return user
}
