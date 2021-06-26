import Task from '../models/Task'

const createTask = async (data: {
  title: string
  project: string
  time: string
}) => {
  try {
    const newTask = {
      title: data.title,
      project: data.project,
      time: data.time,
    }

    const task = new Task(newTask)

    await task.save()

    return task
  } catch (error) {
    console.log(`TaskService => Could not create Task => ${error}`)
  }
}

const getTask = async (taskId: string) => {
  try {
    const task = await Task.findById({ _id: taskId })
    return task
  } catch (error) {
    console.log(`TaskService => Could not fetch Task => ${error}`)
  }
}

const updateTask = async (
  id: string,
  update: {
    title: string
    time: string
    done: boolean
  }
) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: id }, { ...update })
    return task
  } catch (error) {
    console.log(`TaskService => Could not update Task => ${error}`)
  }
}

const deleteTask = async (id: string) => {
  try {
    const task = await Task.findOneAndDelete({ _id: id })
    return task
  } catch (error) {
    console.log(`TaskService => Could not delete Task => ${error}`)
  }
}

const getProjectTasks = async (projectId: string) => {
  try {
    const query: any = { project: projectId }

    const tasks = await Task.find(query)
    return tasks
  } catch (error) {
    console.log(`TaskService => Could not fetch Project's Tasks => ${error}`)
  }
}

export default {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getProjectTasks,
}
