import request from 'supertest'
import { Express } from 'express'

import { createServer } from '../../utils/server'
import db from '../../utils/db'
import { testUser, createTestUser } from '../../utils/tests/testUser'
import User from '../../models/User'

let server: any

beforeAll(async () => {
  await db.connect({ isTest: true })
  server = createServer()
})

afterAll(async (done) => {
  await db.close()
  server.close(done)
})

describe('POST /api/user', () => {
  it('creates a new User', async (done) => {
    const user = testUser()

    const res = await request(server).post('/api/user').send(user)

    expect(res.status).toEqual(201)
    expect(res.body).toMatchObject({
      id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
    })

    const createdUser = await User.findOne({ email: user.email })

    if (!createdUser) {
      throw new Error('User is null')
    }

    expect(createdUser).toBeDefined()
    expect(createdUser.name).toBeTruthy()
    expect(createdUser.email).toBeTruthy()
    expect(createdUser.password).toBeTruthy()
    expect(createdUser.date).toBeTruthy()

    done()
  })
})
