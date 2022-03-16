import { AccountModel, LoadAccountByToken, HttpRequest } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http/http-helpers'
import { AuthMiddleware } from './auth-middleware'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  password: 'hashed_password',
  email: 'valid_email@email.com'
})

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string | undefined): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new LoadAccountByTokenStub()
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

interface SutTypes {
  sut: AuthMiddleware
  loadAccountStub: LoadAccountByToken
}

const makeSut = (role = ''): SutTypes => {
  const loadAccountStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountStub, role)

  return { sut, loadAccountStub }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountStub } = makeSut('any_role')

    const loadSpy = jest.spyOn(loadAccountStub, 'load')

    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return 403 if LoadAccountByToken return null', async () => {
    const { sut, loadAccountStub } = makeSut()

    jest.spyOn(loadAccountStub, 'load').mockResolvedValueOnce(null as unknown as AccountModel)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken return an account', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountStub } = makeSut()

    jest.spyOn(loadAccountStub, 'load').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(500)
  })
})
