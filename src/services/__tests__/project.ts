import { Schema, Types } from 'mongoose'
import faker from 'faker'
import ProjectService from '../project'
import Project from '../../models/Project'

describe('Project Service', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('creates a Project', () => {
    const mockProject = {
      title: faker.lorem.word(),
      user: Types.ObjectId().toString(),
    }

    const spy = jest
      .spyOn(Project.prototype, 'save')
      .mockReturnValueOnce(mockProject as any)

    ProjectService.createProject(mockProject)

    const spyCreatedProject = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyCreatedProject.title).toEqual(mockProject.title)
  })

  it('fetches a Project by id', () => {
    const mockProject = {
      _id: Types.ObjectId(),
      title: faker.lorem.word(),
      user: Types.ObjectId(),
    }

    const spy = jest
      .spyOn(Project, 'findById')
      .mockReturnValueOnce(mockProject as any)

    ProjectService.getProject(mockProject._id.toString())

    const spyFetchedProject = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyFetchedProject._id).toEqual(spyFetchedProject._id)
  })

  it('updates a Project', () => {
    const id = Types.ObjectId().toString()

    const mockUpdate = {
      title: faker.lorem.word(),
    }

    const mockUpdatedProject = {
      _id: id,
      user: Types.ObjectId(),
      ...mockUpdate,
    }

    const spy = jest
      .spyOn(Project, 'findOneAndUpdate')
      .mockReturnValueOnce(mockUpdatedProject as any)

    ProjectService.updateProject(id, mockUpdate)

    const spyUpdatedProject = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyUpdatedProject).toEqual(mockUpdatedProject)
    expect(spy).toHaveBeenCalledWith({ _id: id }, { ...mockUpdate })
  })

  it('deletes a Project', () => {
    const mockProject = {
      _id: Types.ObjectId(),
      title: faker.lorem.word(),
      user: Types.ObjectId(),
    }

    const spy = jest
      .spyOn(Project, 'findOneAndDelete')
      .mockReturnValueOnce(mockProject as any)

    ProjectService.deleteProject(mockProject._id.toString())

    const spyDeletedProject = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyDeletedProject).toEqual(mockProject)
  })

  it("fetches a User's Projects", () => {
    const userId = Types.ObjectId()

    const mockProjectList = [
      {
        _id: Types.ObjectId(),
        title: faker.lorem.word(),
        user: userId,
      },
      {
        _id: Types.ObjectId(),
        title: faker.lorem.word(),
        user: userId,
      },
      {
        _id: Types.ObjectId(),
        title: faker.lorem.word(),
        user: userId,
      },
    ]

    const spy = jest
      .spyOn(Project, 'find')
      .mockReturnValueOnce(mockProjectList as any)

    ProjectService.getUserProjects(userId.toString())

    const spyUserProjects = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyUserProjects).toMatchObject(mockProjectList)
    expect(spy).toHaveBeenCalledWith({ user: userId.toString() })
  })
})
