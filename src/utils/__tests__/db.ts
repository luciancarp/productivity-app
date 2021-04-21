import mongoose from 'mongoose'
import User from '../../models/User'
import db from '../db'
require('dotenv').config()

describe('MongoDB', () => {
  beforeAll(async () => {
    await db.connect({ isTest: true })
  })

  afterAll(async (done) => {
    await db.close()
    done()
  })

  // it('connects', async () => {
  //   let dbUri: string = process.env.MONGO_URI_TEST || ''
  //   let options = {
  //     useUnifiedTopology: true,
  //     useNewUrlParser: true,
  //     useCreateIndex: true,
  //     useFindAndModify: false,
  //   }

  //   mongoose.connect = jest.fn()

  //   await db.connect({ isTest: true })

  //   expect(mongoose.connect).toHaveBeenCalledTimes(1)
  //   expect(mongoose.connect).toHaveBeenCalledWith(dbUri, options)

  //   jest.clearAllMocks()
  // })

  // it('disconnects', async () => {
  //   const spy = jest
  //     .spyOn(mongoose, 'disconnect')
  //     .mockReturnValue('mock' as any)

  //   await db.close()

  //   const spyDisconnect = spy.mock.results[0].value

  //   expect(spy).toHaveBeenCalledTimes(1)
  //   expect(spyDisconnect).toEqual('mock')

  //   jest.clearAllMocks()
  // })

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
})
