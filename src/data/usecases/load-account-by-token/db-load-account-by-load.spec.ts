import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }

  return new DecrypterStub()
}

const makeAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid@email.com',
        password: 'valid-password'
      })
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

interface SutTypes{
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeAccountByTokenRepository()
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)

  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')

    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })
  test('Should return if Decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null as unknown as string)

    const response = await sut.load('any_token', 'any_role')

    expect(response).toBeNull()
  })
  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByToken = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken')
    await sut.load('any_token', 'any_role')

    expect(loadByToken).toHaveBeenCalledWith('any_value', 'any_role')
  })
  test('Should call null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()

    jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken').mockResolvedValueOnce(null as unknown as AccountModel)

    const account = await sut.load('any_token', 'any_role')

    expect(account).toBeNull()
  })
})
