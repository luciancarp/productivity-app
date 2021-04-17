import mongoose from 'mongoose'
import User from '../../models/User'

describe('Connection', () => {
  beforeAll(async () => {
    const db: string = process.env.MONGO_URI_TEST || ''

    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
  })

  test('can create, get, update and remove a user', async () => {
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
    mongoose.disconnect()
    done()
  })
})
