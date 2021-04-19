import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User'

const createUser = async (data: {
  name: string
  email: string
  password: string
}) => {
  try {
    let newUserData = {
      name: data.name,
      email: data.email,
      password: data.password,
    }

    const salt = await bcrypt.genSalt(10)

    newUserData.password = await bcrypt.hash(newUserData.password, salt)

    const user = await new User(newUserData).save()
    return user._id
  } catch (error) {
    console.log(`Could not create User => ${error}`)
  }
}

const getUserById = async (id: string) => {
  try {
    const user = await User.findById(id).select('-password')
    return user
  } catch (error) {
    console.log(`Could not fetch User ${error}`)
  }
}

const getUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email }).select('-password')
    return user
  } catch (error) {
    console.log(`Could not fetch User => ${error}`)
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
    console.log(`Could not update User => ${error}`)
  }
}

const deleteUser = async (id: string) => {
  try {
    const user = await User.findOneAndDelete({ _id: id })
    return user
  } catch (error) {
    console.log(`Could not delete User => ${error}`)
  }
}

const createAuthToken = async (id: string) => {
  try {
    const payload = {
      user: {
        id: id,
      },
    }

    const secret = process.env.JWT_SECRET || ''

    //TODO find better solution for secret
    // 3600 = 1h
    const token = jwt.sign(payload, secret || '', {
      expiresIn: 3600,
    })

    return token
  } catch (error) {
    console.log(`Could not create token ${error}`)
  }
}

const loginUser = async (email: string, password: string) => {
  try {
    let user = await User.findOne({ email })

    if (!user) {
      throw 'Invalid Credentials'
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw 'Invalid Credentials'
    }

    const token = await createAuthToken(user.id)

    return token
  } catch (error) {
    console.log(`Could not login user => ${error}`)
  }
}

export default {
  createUser: createUser,
  getUserById: getUserById,
  getUserByEmail: getUserByEmail,
  updateUser: updateUser,
  deleteUser: deleteUser,
  createAuthToken: createAuthToken,
  loginUser: loginUser,
}
