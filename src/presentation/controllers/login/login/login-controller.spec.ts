import { MissingParamError } from '../../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http-helpers'
import { HttpRequest, Authentication, Validation, AuthenticationModel } from './login-controller-protocols'
import { LoginController } from './login-controller'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error|null {
      return null
    }
  }

  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationSut implements Authentication {
    async auth (authenticationData: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationSut()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'valid_email@test.com',
    password: 'valid_password'
  }
})

interface SutTypes {
  sut: LoginController
  authenticationSut: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationSut = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationSut, validationStub)

  return {
    sut,
    authenticationSut,
    validationStub
  }
}

describe('LoginController', () => {
  test('Should call Authentication with correct value', async () => {
    const { sut, authenticationSut } = makeSut()

    const authSpy = jest.spyOn(authenticationSut, 'auth')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(authSpy)
      .toHaveBeenCalledWith({
        email: httpRequest.body.email,
        password: httpRequest.body.password
      })
  })

  test('Should return 401 if invalid credentials', async () => {
    const { sut, authenticationSut } = makeSut()

    jest.spyOn(authenticationSut, 'auth').mockImplementation(async () => {
      return await Promise.resolve(null)
    })

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSut } = makeSut()

    jest.spyOn(authenticationSut, 'auth').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    await expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 401 if invalid credentials', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({
      accessToken: 'any_token'
    }))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validator return an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any'))

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse)
      .toEqual(badRequest(new MissingParamError('any')))
  })
})
