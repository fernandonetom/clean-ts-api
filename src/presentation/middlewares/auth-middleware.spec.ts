import { AccountModel, LoadAccountByToken } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helpers'
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

interface SutTypes {
  sut: AuthMiddleware
  loadAccountStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountStub)

  return { sut, loadAccountStub }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountStub, 'load')

    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })

    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
