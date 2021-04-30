import mongoose from 'mongoose'

export const removeAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections)

  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany({})
  }
}

export const dropAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections)

  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]

    try {
      await collection.drop()
    } catch (error) {
      console.log(error)
    }
  }
}
