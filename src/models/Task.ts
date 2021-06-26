import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
  title: string
  project: {
    type: Schema.Types.ObjectId
    ref: 'project'
  }
  time: string
  done: boolean
  date: Date
}

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'project',
  },
  time: {
    type: String,
    default: '25:00',
  },
  done: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model<ITask>('Task', taskSchema)
