import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  email: 'any@mail.com',
  password: 'any_password',
  name: 'any_name',
  id: 'any_id'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()

      return await Promise.resolve(account)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return { sut, loadAccountByEmailRepositoryStub }
}

describe('DB Authentication use case', () => {
  test('Should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any@mail.com')
  })

  test('Should throw if LoadAccountByEmail throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })
})
