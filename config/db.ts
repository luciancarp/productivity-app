import mongoose from 'mongoose'

const db: string = process.env.MONGO_URI || ''

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    console.log('MongoDB connected')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

export default connectDB
