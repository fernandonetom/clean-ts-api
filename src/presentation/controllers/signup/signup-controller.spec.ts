import { MissingParamError, ServerError } from '../../errors'
import { Validation, AccountModel, AddAccount, AddAccountModel, HttpRequest } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { ok, badRequest, serverError } from '../../helpers/http/http-helpers'

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
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)

  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
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
