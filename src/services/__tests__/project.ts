import { Schema, Types } from 'mongoose'
import ProjectService from '../project'
import Project from '../../models/Project'

describe('Project Service', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  it('fetches all Projects', () => {
    const mockProjectList = [
      {
        title: 'test0',
        user: new Schema.Types.ObjectId('test0'),
      },
      {
        title: 'test1',
        user: new Schema.Types.ObjectId('test1'),
      },
      {
        title: 'test2',
        user: new Schema.Types.ObjectId('test2'),
      },
    ]

    const spy = jest
      .spyOn(Project, 'find')
      .mockReturnValueOnce(mockProjectList as any)

    ProjectService.getAllProjects()

    const spyFetchedProjects = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyFetchedProjects).toHaveLength(3)
  })

  it('creates a Project', () => {
    const mockProject = {
      title: 'test',
      user: new Schema.Types.ObjectId('test'),
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
      title: 'test',
      user: new Schema.Types.ObjectId('test'),
    }

    const spy = jest
      .spyOn(Project, 'findById')
      .mockReturnValueOnce(mockProject as any)

    ProjectService.getProjectbyId(mockProject._id.toString())

    const spyFetchedProject = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyFetchedProject._id).toEqual(spyFetchedProject._id)
  })

  it('deletes a project', () => {
    const mockProject = {
      _id: Types.ObjectId(),
      title: 'test',
      user: new Schema.Types.ObjectId('test'),
    }

    const spy = jest
      .spyOn(Project, 'findOneAndDelete')
      .mockReturnValueOnce(mockProject as any)

    ProjectService.deleteProject(mockProject._id.toString())

    const spyDeletedProject = spy.mock.results[0].value

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyDeletedProject).toEqual(mockProject)
  })
})
