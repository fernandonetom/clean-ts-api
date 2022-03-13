import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  email: 'any@mail.com',
  password: 'hashed_password',
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

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (payload: string): Promise<string> {
      return 'any_token'
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailStub()
  const hashComparerStub = makeHashComparerStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
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

  test('Should return null if LoadAccountByEmail returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockResolvedValueOnce(null as unknown as AccountModel)

    const token = await sut.auth(makeFakeAuthentication())

    expect(token).toBeNull()
  })

  test('Should call HashComparer with correct email', async () => {
    const { sut, hashComparerStub } = makeSut()

    const loadSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare')
      .mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashCompare returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare')
      .mockResolvedValueOnce(false)

    const token = await sut.auth(makeFakeAuthentication())

    expect(token).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const generatorSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.auth(makeFakeAuthentication())

    expect(generatorSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    jest.spyOn(tokenGeneratorStub, 'generate')
      .mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test('Should call return a token on success', async () => {
    const { sut } = makeSut()

    const token = await sut.auth(makeFakeAuthentication())

    expect(token).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
})
