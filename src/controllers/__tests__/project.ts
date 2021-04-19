import request from 'supertest'
import { createServer } from '../../utils/server'
import db from '../../utils/db'
import { Express } from 'express'

let app: Express

beforeAll(async () => {
  await db.connect()
  app = await createServer()
})

describe('POST /api/project', () => {
  it('creates a new Project', async (done) => {
    request(app)
      .post('/api/project')
      .send({
        title: 'test',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .catch((err) => done(err))
  })
})

afterAll(async () => {
  await db.close()
})
