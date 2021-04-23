import request from 'supertest'
import { Express } from 'express'

import { createServer } from '../../utils/server'
import db from '../../utils/db'
import { mockUser } from '../../utils/tests/testUser'
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
    const { name, email, password } = mockUser

    const res = await request(server)
      .post('/api/user')
      .send({ name, email, password })

    expect(res.status).toEqual(201)
    expect(res.body).toMatchObject({
      id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
    })

    const createdUser = await User.findOne({ email })

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

describe('POST /api/user/login', () => {
  it('given a valid login request returns 200 and token', async () => {})
  it('given an invalid email returns 404 error', async () => {})
  it('given an invalid passowrd returns 404 error', async () => {})
})
describe('GET /api/user', () => {})
