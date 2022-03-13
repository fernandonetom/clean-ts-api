import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
  },
  async compare (): Promise<boolean> {
    return true
  }
}))
interface SutTypes{
  sut: BcryptAdapter
}

const salt = 12

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(salt)

  return {
    sut
  }
}

describe('Bcrypt adapter', () => {
  test('Should call hash with correct values', async () => {
    const { sut } = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a valid hash on success', async () => {
    const { sut } = makeSut()

    const hash = await sut.hash('any_value')

    expect(hash).toBe('hash')
  })

  test('Should throw if hash throws', async () => {
    const { sut } = makeSut()

    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const promise = sut.hash('any_value')

    await expect(promise).rejects.toThrowError(Error)
  })

  test('Should call compare with correct values', async () => {
    const { sut } = makeSut()

    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'compare_value')

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'compare_value')
  })

  test('Should return a true on compare', async () => {
    const { sut } = makeSut()

    const compare = await sut.compare('any_value', 'compare_value')

    expect(compare).toBe(true)
  })

  test('Should return a false on compare fails', async () => {
    const { sut } = makeSut()

    jest.spyOn(bcrypt, 'compare')
      .mockResolvedValue(false as never)

    const compare = await sut.compare('any_value', 'compare_value')

    expect(compare).toBe(false)
  })
})
