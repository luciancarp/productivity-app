import User from '../models/User'

const createUser = async (data: {
  name: string
  email: string
  password: string
}) => {
  try {
    const user = await new User(data).save()
    return user
  } catch (error) {
    console.log(`Could not create User ${error}`)
  }
}

const getUserById = async (id: string) => {
  try {
    const user = await User.findById(id)
    return user
  } catch (error) {
    console.log(`Could not fetch user ${error}`)
  }
}

const updateUser = async (
  id: string,
  update: {
    name: string
    email: string
    password: string
  }
) => {
  try {
    const user = await User.findOneAndUpdate({ _id: id }, { ...update })
    return user
  } catch (error) {
    console.log(`Could not update User ${error}`)
  }
}

const deleteUser = async (id: string) => {
  try {
    const user = await User.findOneAndDelete({ _id: id })
    return user
  } catch (error) {
    console.log(`Could not delete User ${error}`)
  }
}

export default {
  createUser: createUser,
  getUserById: getUserById,
  updateUser: updateUser,
  deleteUser: deleteUser,
}
