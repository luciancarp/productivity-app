import User from '../../models/User'
import db from '../db'

describe('Connection', () => {
  beforeAll(async () => {
    await db.connect()
  })

  it('can create, get, update and remove a user', async () => {
    const testUser = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    }

    const user = await new User(testUser).save()

    const fetchedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { name: 'updatedTest' },
      { new: true }
    )

    let newUserName = ''
    if (fetchedUser) newUserName = fetchedUser.name

    expect(newUserName).toEqual('updatedTest')

    await user.remove()
  })

  afterAll(async (done) => {
    await db.close()
    done()
  })
})
