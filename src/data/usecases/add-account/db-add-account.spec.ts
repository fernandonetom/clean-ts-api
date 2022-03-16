import { AccountModel, AddAccountModel, Hasher } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  password: 'hashed_password',
  email: 'valid_email@email.com'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return await Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(null as unknown as AccountModel)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes{
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailStub()
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )

  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    const hasherSpy = jest.spyOn(hasherStub, 'hash')

    const accountData = makeFakeAccountData()

    await sut.add(accountData)
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockRejectedValue(new Error())

    const accountData = makeFakeAccountData()
    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrowError(Error)
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = makeFakeAccountData()

    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValue(new Error())

    const accountData = makeFakeAccountData()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrowError(Error)
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    const account = await sut.add(accountData)
    expect(account).toEqual(makeFakeAccount())
  })

  test('Should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(makeFakeAccountData())

    expect(loadSpy).toHaveBeenCalledWith('valid_email@email.com')
  })

  test('Should return null if LoadAccountByEmail not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(makeFakeAccount())

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    const account = await sut.add(accountData)
    expect(account).toBeNull()
  })
})
