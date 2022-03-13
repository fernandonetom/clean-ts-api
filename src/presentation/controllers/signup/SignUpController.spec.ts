import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { Validation, EmailValidator, AccountModel, AddAccount, AddAccountModel, HttpRequest } from './SignUpProtocols'
import { SignUpController } from './SignUpController'
import { ok, badRequest, serverError } from '../../helpers/HttpHelpers'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error|null {
      return null
    }
  }

  return new ValidationStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()

      return await Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any name',
    email: 'any_email@email.com',
    password: 'password',
    passwordConfirmation: 'password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@email.com',
  password: 'valid-password'
})
interface SutTypes{
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 when name is not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: undefined,
        email: 'any_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse)
      .toEqual(badRequest(new MissingParamError('name')))
  })
  it('Should return 400 when email is not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any name',
        email: undefined,
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse)
      .toEqual(badRequest(new MissingParamError('email')))
  })
  it('Should return 400 when password is not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: undefined,
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse)
      .toEqual(badRequest(new MissingParamError('password')))
  })
  it('Should return 400 when passwordConfirmation is not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any',
        passwordConfirmation: undefined
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse)
      .toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })
  it('Should return 400 if passwordConfirmation fails', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any',
        passwordConfirmation: 'invalid_confirmation'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse)
      .toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })
  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse)
      .toEqual(badRequest(new InvalidParamError('email')))
  })
  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementation(() => {
        throw new Error()
      })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse)
      .toEqual(serverError(new ServerError('')))
  })
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any_email@email.com',
      password: 'password'
    })
  })
  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add')
      .mockImplementation(async () => {
        return await Promise.reject(new Error('ServerError'))
      })

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse)
      .toEqual(serverError(new ServerError('')))
  })
  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
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
