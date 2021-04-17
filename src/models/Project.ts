import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
  title: string
  user: {
    type: Schema.Types.ObjectId
    ref: 'user'
  }
  date: Date
}

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model<IProject>('Project', projectSchema)
