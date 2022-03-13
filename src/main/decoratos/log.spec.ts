import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'
import { serverError, ok } from '../../presentation/helpers/http/http-helpers'
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

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@email.com',
  password: 'valid-password'
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'AnyError'
  return serverError(fakeError)
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any name',
    email: 'any_email@email.com',
    password: 'password',
    passwordConfirmation: 'password'
  }
})

const makeController = (): Controller => {
  class ControllerSut implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return ok(makeFakeAccount())
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

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(controllerSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Should return the same value thats controller', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(ok(makeFakeAccount()))
  })
  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSut, logErrorRepositoryStub } = makeSut()

    jest.spyOn(controllerSut, 'handle')
      .mockResolvedValueOnce(makeFakeServerError())

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('AnyError')
  })
})
