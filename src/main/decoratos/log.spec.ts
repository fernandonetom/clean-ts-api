import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerSut: Controller
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

const makeSut = (): SutTypes => {
  const controllerSut = makeController()
  const logControllerDecorator = new LogControllerDecorator(controllerSut)

  return { sut: logControllerDecorator, controllerSut }
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
})
