import request from 'supertest'
import { createServer } from '../server'

describe('createServer', () => {
  let server: any
  const PORT = process.env.PORT || '5000'

  beforeAll(() => {
    server = createServer(PORT)
  })

  afterAll((done) => {
    server.close(done)
  })

  it('starts a server', async () => {
    const res = await request(server).get('/')

    expect(res.status).toEqual(200)
  })
})
