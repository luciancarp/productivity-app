import mongoose from 'mongoose'
require('dotenv').config()

const connect = async (settings: { isTest: boolean }) => {
  let db: string = process.env.MONGO_URI || ''

  if (settings.isTest) db = process.env.MONGO_URI_TEST || ''

  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    console.log('MongoDB connected')
  } catch (error) {
    console.log(`Could not connect MongoDB => ${error}`)
    process.exit(1)
  }
}

const close = async () => {
  try {
    await mongoose.disconnect()
  } catch (error) {
    console.log(`Could not disconnect MongoDB => ${error}`)
  }
}

export default {
  connect: connect,
  close: close,
}
