import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/HttpHelpers'
import { EmailValidator } from '../signup/SignUpProtocols'
import { LoginController } from './login'
import { HttpRequest } from '../../protocols/http'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorSut implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorSut()
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
}

const makeSut = (): SutTypes => {
  const emailValidatorSut = makeEmailValidator()
  const sut = new LoginController(emailValidatorSut)

  return {
    sut,
    emailValidatorSut
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

    const validatorSpy = jest.spyOn(emailValidatorSut, 'isValid').mockReturnValueOnce(false)

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
})
