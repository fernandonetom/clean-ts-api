import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter'
import { BcryptAdapter } from './bcrypt-adapter'

interface SutTypes{
  sut: Encrypter
}

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(12)

  return {
    sut
  }
}

describe('Bcrypt adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })
})
