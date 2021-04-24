import request from 'supertest'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import faker from 'faker'

import { createServer } from '../../utils/server'
import db from '../../utils/db'
import {
  mockUser,
  authorizedTestUser,
  testUser,
} from '../../utils/tests/testUser'
import User from '../../models/User'
import UserService from '../../services/user'

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
  const passwordNewValidationError =
    'Please enter a password with 6 or more characters'
  const nameValidationError = 'Name is required'
  const emailValidationError = 'Please include a valid email'

  it('given a valid request creates user then returns 201 and user id', async (done) => {
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

    expect(res.body).toMatchObject({
      id: createdUser._id.toString(),
    })

    done()
  })

  it('if user already exists returns 400 error', async (done) => {
    const { user, password } = await testUser()

    const res = await request(server)
      .post('/api/user')
      .send({ name: user.name, email: user.email, password })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual('User already exists')

    done()
  })

  it('given an invalid name returns 400 error', async (done) => {
    const name = ''
    const email = faker.internet.email()
    const password = faker.internet.password()

    const res = await request(server)
      .post('/api/user')
      .send({ name, email, password })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(nameValidationError)

    done()
  })
  it('given no name returns 400 error', async (done) => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    const res = await request(server)
      .post('/api/user')
      .send({ email, password })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(nameValidationError)

    done()
  })
  it('given a null name returns 400 error', async (done) => {
    const name = null
    const email = faker.internet.email()
    const password = faker.internet.password()

    const res = await request(server)
      .post('/api/user')
      .send({ name, email, password })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(nameValidationError)

    done()
  })

  it('given an invalid email returns 400 error', async (done) => {
    const name = faker.name.firstName()
    const email = 'invalid'
    const password = faker.internet.password()

    const res = await request(server)
      .post('/api/user')
      .send({ name, email, password })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(emailValidationError)

    done()
  })
  it('given no email returns 400 error', async (done) => {
    const name = faker.name.firstName()
    const password = faker.internet.password()

    const res = await request(server).post('/api/user').send({ name, password })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(emailValidationError)

    done()
  })
  it('given a null email returns 400 error', async (done) => {
    const name = faker.name.firstName()
    const email = null
    const password = faker.internet.password()

    const res = await request(server)
      .post('/api/user')
      .send({ name, email, password })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(emailValidationError)

    done()
  })

  it('given an invalid password returns 400 error', async (done) => {
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = ''

    const res = await request(server)
      .post('/api/user')
      .send({ name, email, password })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(passwordNewValidationError)

    done()
  })
  it('given no password returns 400 error', async (done) => {
    const name = faker.name.firstName()
    const email = faker.internet.email()

    const res = await request(server).post('/api/user').send({ name, email })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(passwordNewValidationError)

    done()
  })
  it('given a null password returns 400 error', async (done) => {
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = null

    const res = await request(server)
      .post('/api/user')
      .send({ name, email, password })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(passwordNewValidationError)

    done()
  })

  it('returns 500 if there is a server error', async (done) => {
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const errorMsg = 'Server error'

    // UserService.createUser = jest.fn(() => {
    //   throw new Error(errorMsg)
    // })

    const spy = jest.spyOn(UserService, 'createUser').mockImplementation(() => {
      throw new Error(errorMsg)
    })

    const res = await request(server)
      .post('/api/user')
      .send({ name, email, password })

    expect(res.status).toEqual(500)
    expect(res.body.errors[0].msg).toEqual(errorMsg)

    spy.mockRestore()

    done()
  })
})

describe('POST /api/user/login', () => {
  const emailValidationError = 'Please include a valid email'
  const passwordValidationError = 'Password is required'

  it('given a valid login request returns 200 and token', async (done) => {
    const { user, password } = await testUser()

    const res = await request(server).post('/api/user/login').send({
      email: user.email,
      password: password,
    })

    expect(res.status).toEqual(200)
    expect(res.body.token).toBeTruthy()

    let errorToken
    let decodedToken: any
    jwt.verify(
      res.body.token,
      process.env.JWT_SECRET || '',
      (error: any, decoded: any) => {
        errorToken = error
        decodedToken = decoded
      }
    )

    expect(errorToken).toBeNull()
    expect(decodedToken).toBeTruthy()
    expect(decodedToken).toMatchObject({
      user: {
        id: user._id.toString(),
      },
    })

    done()
  })

  it('given an invalid email returns 400 error', async (done) => {
    const invalidEmail = 'invalid'
    const password = faker.internet.password()

    const res = await request(server).post('/api/user/login').send({
      email: invalidEmail,
      password: password,
    })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(emailValidationError)

    done()
  })

  it('given no email returns 400 error', async (done) => {
    const password = faker.internet.password()

    const res = await request(server).post('/api/user/login').send({
      password,
    })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(emailValidationError)

    done()
  })

  it('given null email returns 400 error', async (done) => {
    const email = null
    const password = faker.internet.password()

    const res = await request(server).post('/api/user/login').send({
      email,
      password,
    })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(emailValidationError)

    done()
  })

  it('given an invalid password returns 400 error', async (done) => {
    const { user, password } = await testUser()
    const invalidPassword = faker.internet.password()

    const res = await request(server).post('/api/user/login').send({
      email: user.email,
      password: invalidPassword,
    })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual('Incorrect email or password')

    done()
  })

  it('given null password return 400 error', async () => {
    const { user, password } = await testUser()
    const invalidPassword = null

    const res = await request(server).post('/api/user/login').send({
      email: user.email,
      password: invalidPassword,
    })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(passwordValidationError)
  })

  it('given empty string password return 400 error', async () => {
    const { user, password } = await testUser()
    const invalidPassword = ''

    const res = await request(server).post('/api/user/login').send({
      email: user.email,
      password: invalidPassword,
    })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(passwordValidationError)
  })

  it('given no password returns 400 error', async (done) => {
    const { user, password } = await testUser()

    const res = await request(server).post('/api/user/login').send({
      email: user.email,
    })

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(passwordValidationError)

    done()
  })

  it('returns 500 if there is a server error', async (done) => {
    const user = mockUser
    const errorMsg = 'Server error'

    UserService.loginUser = jest.fn(() => {
      throw new Error(errorMsg)
    })

    const res = await request(server).post('/api/user/login').send({
      email: user.email,
      password: user.password,
    })

    expect(res.status).toEqual(500)
    expect(res.body.errors[0].msg).toEqual(errorMsg)

    jest.restoreAllMocks()
    done()
  })
})

describe('GET /api/user', () => {
  it('returns 200 and user info', async (done) => {
    const { user, token } = await authorizedTestUser()

    if (token === undefined) throw new Error('No token')

    const res = await request(server)
      .get('/api/user')
      .set('x-auth-token', token)

    expect(res.status).toEqual(200)
    expect(res.body).toBeDefined()

    const { _id, name, email, date } = user

    expect(res.body).toMatchObject({
      _id: _id.toString(),
      name,
      email,
      date: date.toJSON(),
    })

    done()
  })

  it('returns 404 if the id from token payload is invalid', async (done) => {
    const token = await UserService.createAuthToken(Types.ObjectId().toString())

    if (token === undefined) throw new Error('No token')

    const res = await request(server)
      .get('/api/user')
      .set('x-auth-token', token)

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual('User not found')

    done()
  })

  it('returns 500 if there is a server error', async (done) => {
    const token = await UserService.createAuthToken(Types.ObjectId().toString())

    if (token === undefined) throw new Error('No token')

    const errorMsg = 'Server error'

    UserService.getUserById = jest.fn().mockImplementation(() => {
      throw new Error(errorMsg)
    })

    const res = await request(server)
      .get('/api/user')
      .set('x-auth-token', token)

    expect(res.status).toEqual(500)
    expect(res.body.errors[0].msg).toEqual(errorMsg)

    jest.restoreAllMocks()
    done()
  })
})
