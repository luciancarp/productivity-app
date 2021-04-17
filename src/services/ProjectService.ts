import Project, { IProject } from '../models/Project'
import { Schema } from 'mongoose'

export default class ProjectService {
  static async getAllProjects() {
    try {
      const allProjects = await Project.find()
      return allProjects
    } catch (error) {
      console.log(`Could not fetch Projects ${error}`)
    }
  }

  static async createProject(data: {
    title: string
    user: Schema.Types.ObjectId
  }) {
    try {
      const newProject = {
        title: data.title,
        user: data.user,
      }
      const response = await new Project(newProject).save()
      return response
    } catch (error) {
      console.log(error)
    }
  }
  static async getProjectbyId(projectId: string) {
    try {
      const singleProjectResponse = await Project.findById({ _id: projectId })
      return singleProjectResponse
    } catch (error) {
      console.log(`Project not found. ${error}`)
    }
  }

  //TODO updateProject

  static async deleteProject(projectId: string) {
    try {
      const deletedResponse = await Project.findOneAndDelete({ _id: projectId })
      return deletedResponse
    } catch (error) {
      console.log(`Could not delete Project ${error}`)
    }
  }
}
