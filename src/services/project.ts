import Project from '../models/Project'

const createProject = async (data: { title: string; user: string }) => {
  try {
    const newProject = {
      title: data.title,
      user: data.user,
    }

    const project = new Project(newProject)

    await project.save()

    return project
  } catch (error) {
    console.log(`ProjectService => Could not create Project => ${error}`)
  }
}

const getProject = async (projectId: string) => {
  try {
    const project = await Project.findById({ _id: projectId })
    return project
  } catch (error) {
    console.log(`ProjectService => Could not fetch Project => ${error}`)
  }
}

const updateProject = async (
  id: string,
  update: {
    title: string
  }
) => {
  try {
    const project = await Project.findOneAndUpdate({ _id: id }, { ...update })
    return project
  } catch (error) {
    console.log(`ProjectService => Could not update Project => ${error}`)
  }
}

const deleteProject = async (id: string) => {
  try {
    const project = await Project.findOneAndDelete({ _id: id })
    return project
  } catch (error) {
    console.log(`ProjectService => Could not delete Project => ${error}`)
  }
}

const getUserProjects = async (userId: string) => {
  try {
    const query: any = { user: userId }

    const projects = await Project.find(query)
    return projects
  } catch (error) {
    console.log(`ProjectService => Could not fetch User's Projects => ${error}`)
  }
}

export default {
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getUserProjects,
}
