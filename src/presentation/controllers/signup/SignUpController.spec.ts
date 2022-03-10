import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './SignUpProtocols'
import { SignUpController } from './SignUpController'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid@email.com',
        password: 'valid-password'
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

interface SutTypes{
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 when name is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: undefined,
        email: 'any_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  it('Should return 400 when email is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any name',
        email: undefined,
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  it('Should return 400 when password is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: undefined,
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  it('Should return 400 when passwordConfirmation is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any',
        passwordConfirmation: undefined
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  it('Should return 400 if passwordConfirmation fails', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any',
        passwordConfirmation: 'invalid_confirmation'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
  it('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  it('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementation(() => {
        throw new Error()
      })

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  it('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any_email@email.com',
      password: 'any'
    })
  })
  it('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add')
      .mockImplementation(() => {
        throw new Error()
      })

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
