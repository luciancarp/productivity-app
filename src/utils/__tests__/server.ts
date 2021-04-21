import request from 'supertest'
import { createServer } from '../server'

describe('createServer', () => {
  let server: any

  beforeAll(() => {
    server = createServer()
  })

  afterAll((done) => {
    server.close(done)
  })

  it('starts a server', async () => {
    const res = await request(server).get('/')

    expect(res.status).toEqual(200)
  })
})
