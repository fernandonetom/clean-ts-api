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
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid@email.com',
        password: 'valid-password'
      }

      return await Promise.resolve(fakeAccount)
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

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
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

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
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

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
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

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
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

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  it('Should call EmailValidator with correct email', async () => {
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

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
  it('Should return 400 if an invalid email is provided', async () => {
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

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementation(() => {
        throw new Error('ServerError')
      })

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('ServerError'))
  })
  it('Should call AddAccount with correct values', async () => {
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

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any_email@email.com',
      password: 'any'
    })
  })
  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add')
      .mockImplementation(async () => {
        return await Promise.reject(new Error('ServerError'))
      })

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('ServerError'))
  })
  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid@email.com',
        password: 'valid-password',
        passwordConfirmation: 'valid-password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid-password'
    })
  })
})
