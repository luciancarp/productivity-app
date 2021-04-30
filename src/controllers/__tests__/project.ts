import request from 'supertest'
import faker from 'faker'
import { Types } from 'mongoose'

import { testServer } from '../../utils/tests/testServer'
import { authorizedTestUser, testUser } from '../../utils/tests/testUser'
import Project, { IProject } from '../../models/Project'
import UserService from '../../services/user'
import ProjectService from '../../services/project'
import db from '../../utils/db'

let app: any

beforeAll(async () => {
  await db.connect({ isTest: true })
  app = testServer()
})

afterAll(async () => {
  await db.close()
})

describe('POST /api/project', () => {
  const titleValidationError = 'Title is required'

  it('given a valid request creates project then returns 201 and project', async (done) => {
    const { user, token } = await authorizedTestUser()
    if (token === undefined) throw new Error('No token')

    const projectData = { title: faker.lorem.word() }

    const res = await request(app)
      .post('/api/project')
      .set('x-auth-token', token)
      .send(projectData)

    expect(res.status).toEqual(201)
    expect(res.body.title).toEqual(projectData.title)

    const userRef = {
      user: res.body.user,
    }

    const userId = {
      user: user._id.toString(),
    }

    expect(userRef).toMatchObject(userId)

    const project = await Project.findById(res.body._id)

    if (!project) {
      throw new Error('Project is null')
    }

    expect(project).toBeDefined()
    expect(project._id.toString()).toEqual(res.body._id)
    expect(project.title).toEqual(res.body.title)
    expect(project.user.toString()).toEqual(res.body.user)
    expect(project.date.toJSON()).toEqual(res.body.date)

    done()
  })

  it('given an invalid title returns 400 error', async (done) => {
    const testId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testId)

    if (token === undefined) throw new Error('No token')

    const projectData = { title: '' }

    const res = await request(app)
      .post('/api/project')
      .set('x-auth-token', token)
      .send(projectData)

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(titleValidationError)

    done()
  })
  it('given no title returns 400 error', async (done) => {
    const testId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testId)

    if (token === undefined) throw new Error('No token')

    const projectData = {}

    const res = await request(app)
      .post('/api/project')
      .set('x-auth-token', token)
      .send(projectData)

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(titleValidationError)

    done()
  })
  it('given a null invalid title returns 400 error', async (done) => {
    const testId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testId)

    if (token === undefined) throw new Error('No token')

    const projectData = { title: null }

    const res = await request(app)
      .post('/api/project')
      .set('x-auth-token', token)
      .send(projectData)

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual(titleValidationError)

    done()
  })

  it('returns 500 if there is a server error', async (done) => {
    const errorMsg = 'Server error'

    const testId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testId)

    if (token === undefined) throw new Error('No token')

    const spy = jest
      .spyOn(ProjectService, 'createProject')
      .mockImplementation(() => {
        throw new Error(errorMsg)
      })

    const projectData = { title: faker.lorem.word() }

    const res = await request(app)
      .post('/api/project')
      .set('x-auth-token', token)
      .send(projectData)

    expect(res.status).toEqual(500)
    expect(res.body.errors[0].msg).toEqual(errorMsg)

    spy.mockRestore()
    done()
  })
})

describe('GET /api/project', () => {
  it('returns 200 and project', async (done) => {
    const testUserId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testUserId)

    if (token === undefined) throw new Error('No token')

    const projectData = { title: faker.lorem.word() }

    const project = await ProjectService.createProject({
      title: projectData.title,
      user: testUserId,
    })

    if (!project) {
      throw new Error('Project is null')
    }

    const res = await request(app)
      .get(`/api/project/${project._id.toString()}`)
      .set('x-auth-token', token)

    expect(res.status).toEqual(200)
    expect(res.body).toBeDefined()

    const { _id, title, user, date } = project

    expect(res.body).toMatchObject({
      _id: _id.toString(),
      title,
      user: user.toString(),
      date: date.toJSON(),
    })

    done()
  })

  it('given an invalid id returns 400 error', async (done) => {
    const testUserId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testUserId)

    if (token === undefined) throw new Error('No token')

    const invalidProjectId = Types.ObjectId().toString()

    const res = await request(app)
      .get(`/api/project/${invalidProjectId}`)
      .set('x-auth-token', token)

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual('Project not found')

    done()
  })

  it('returns 500 if there is a server error', async (done) => {
    const errorMsg = 'Server error'

    const testUserId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testUserId)

    if (token === undefined) throw new Error('No token')

    const projectId = Types.ObjectId().toString()

    const spy = jest
      .spyOn(ProjectService, 'getProject')
      .mockImplementation(() => {
        throw new Error(errorMsg)
      })

    const res = await request(app)
      .get(`/api/project/${projectId}`)
      .set('x-auth-token', token)

    expect(res.status).toEqual(500)
    expect(res.body.errors[0].msg).toEqual(errorMsg)

    spy.mockRestore()
    done()
  })
})

describe('DELETE /api/project', () => {
  it('deletes project then returns 200 and project', async (done) => {
    const testUserId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testUserId)

    if (token === undefined) throw new Error('No token')

    const projectData = { title: faker.lorem.word() }

    const project = await ProjectService.createProject({
      title: projectData.title,
      user: testUserId,
    })

    if (!project) {
      throw new Error('Project is null')
    }

    const res = await request(app)
      .delete(`/api/project/${project._id.toString()}`)
      .set('x-auth-token', token)

    expect(res.status).toEqual(200)
    expect(res.body).toBeDefined()

    const { _id, title, user, date } = project

    expect(res.body).toMatchObject({
      _id: _id.toString(),
      title,
      user: user.toString(),
      date: date.toJSON(),
    })

    const deletedProject = await Project.findById(project._id)

    expect(deletedProject).toBeNull()

    done()
  })

  it('given an invalid id returns 400 error', async (done) => {
    const testUserId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testUserId)

    if (token === undefined) throw new Error('No token')

    const invalidProjectId = Types.ObjectId().toString()

    const res = await request(app)
      .delete(`/api/project/${invalidProjectId}`)
      .set('x-auth-token', token)

    expect(res.status).toEqual(400)
    expect(res.body.errors[0].msg).toEqual('Project not found')

    done()
  })

  it('given an invalid userId in token returns 403 error', async (done) => {
    const invalidUserId = Types.ObjectId().toString()
    const testUserId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(invalidUserId)

    if (token === undefined) throw new Error('No token')

    const projectData = { title: faker.lorem.word() }

    const project = await ProjectService.createProject({
      title: projectData.title,
      user: testUserId,
    })

    if (!project) {
      throw new Error('Project is null')
    }

    const res = await request(app)
      .delete(`/api/project/${project._id.toString()}`)
      .set('x-auth-token', token)

    expect(res.status).toEqual(403)
    expect(res.body.errors[0].msg).toEqual('User not authorized')

    done()
  })

  it('returns 500 if there is a server error', async (done) => {
    const errorMsg = 'Server error'

    const testUserId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testUserId)

    if (token === undefined) throw new Error('No token')

    const projectData = { title: faker.lorem.word() }

    const project = await ProjectService.createProject({
      title: projectData.title,
      user: testUserId,
    })

    if (!project) {
      throw new Error('Project is null')
    }

    const spy = jest
      .spyOn(ProjectService, 'deleteProject')
      .mockImplementation(() => {
        throw new Error('mock error')
      })

    const res = await request(app)
      .delete(`/api/project/${project._id.toString()}`)
      .set('x-auth-token', token)

    expect(res.status).toEqual(500)
    expect(res.body.errors[0].msg).toEqual(errorMsg)

    spy.mockRestore()
    done()
  })
})

describe('GET /api/project/user', () => {
  it('returns 200 and projects', async (done) => {
    const testUserId = Types.ObjectId().toString()
    const token = await UserService.createAuthToken(testUserId)

    if (token === undefined) throw new Error('No token')

    let projectDataList: string[] = []

    for (let i = 0; i < 4; i++) {
      const title = faker.lorem.word()
      await ProjectService.createProject({
        title,
        user: testUserId,
      })
      projectDataList.push(title)
    }

    const res = await request(app)
      .get(`/api/project/user`)
      .set('x-auth-token', token)

    expect(res.status).toEqual(200)
    expect(res.body).toBeDefined()

    const resProjectData = res.body.map((project: IProject) => project.title)

    const resProjectsUser = res.body.map((project: IProject) => ({
      id: project.user,
    }))

    let projectsCorrectUser = true

    for (let resProjectUser of resProjectsUser) {
      if (resProjectUser.id !== testUserId) {
        projectsCorrectUser = false
        break
      }
    }

    expect(projectsCorrectUser).toBe(true)

    expect(projectDataList.sort()).toEqual(resProjectData.sort())

    done()
  })

  // it('returns 500 if there is a server error', async (done) => {})
})
