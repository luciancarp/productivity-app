import mongoose from 'mongoose'
require('dotenv').config()

const db: string = process.env.MONGO_URI || ''

const connect = async () => {
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
