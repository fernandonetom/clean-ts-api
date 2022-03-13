import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/HttpHelpers'
import { EmailValidator } from '../signup/SignUpProtocols'
import { LoginController } from './login'
import { HttpRequest } from '../../protocols/http'
import { Authentication } from '../../../domain/usecases/authentication'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorSut implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorSut()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationSut implements Authentication {
    async auth (email: string, password: string): Promise<string> {
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
  emailValidatorSut: EmailValidator
  authenticationSut: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationSut = makeAuthentication()
  const emailValidatorSut = makeEmailValidator()
  const sut = new LoginController(emailValidatorSut, authenticationSut)

  return {
    sut,
    emailValidatorSut,
    authenticationSut
  }
}

describe('LoginController', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorSut } = makeSut()

    const validatorSpy = jest.spyOn(emailValidatorSut, 'isValid')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSut } = makeSut()

    jest.spyOn(emailValidatorSut, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorSut } = makeSut()

    jest.spyOn(emailValidatorSut, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    await expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct value', async () => {
    const { sut, authenticationSut } = makeSut()

    const authSpy = jest.spyOn(authenticationSut, 'auth')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(authSpy)
      .toHaveBeenCalledWith(httpRequest.body.email,
        httpRequest.body.password)
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
})
