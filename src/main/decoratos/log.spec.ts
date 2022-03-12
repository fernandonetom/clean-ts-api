import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/HttpHelpers'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerSut implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return {
        statusCode: 200,
        body: {
          name: 'any_body_name'
        }
      }
    }
  }

  return new ControllerSut()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerSut: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerSut = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const logControllerDecorator = new LogControllerDecorator(controllerSut, logErrorRepositoryStub)

  return { sut: logControllerDecorator, controllerSut, logErrorRepositoryStub }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle with correct values', async () => {
    const { sut, controllerSut } = makeSut()

    const controllerSpy = jest.spyOn(controllerSut, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@test.com',
        name: 'any_name',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    await sut.handle(httpRequest)

    expect(controllerSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Should return the same value thats controller', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@test.com',
        name: 'any_name',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response).toEqual({
      statusCode: 200,
      body: {
        name: 'any_body_name'
      }
    })
  })
  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSut, logErrorRepositoryStub } = makeSut()

    const error = new Error()
    error.stack = 'AnyError'

    jest.spyOn(controllerSut, 'handle')
      .mockResolvedValueOnce(serverError(error))

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@test.com',
        name: 'any_name',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('AnyError')
  })
})
