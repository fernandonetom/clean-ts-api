import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign: async () => 'token',
  verify: async () => 'value'
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
  describe('Sign()', () => {
    test('Should calls sign with correct values', async () => {
      const sut = makeSut()
      const jwtSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_value')

      expect(jwtSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()

      const token = await sut.encrypt('any_value')

      expect(token).toBe('token')
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'sign').mockRejectedValueOnce(new Error() as never)

      const promise = sut.encrypt('any_value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('decode()', () => {
    test('Should calls verify with correct values', async () => {
      const sut = makeSut()
      const jwtSpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt('any_token')

      expect(jwtSpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()

      const value = await sut.decrypt('any_token')

      expect(value).toEqual('value')
    })

    test('Should throw if verify throws', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'verify').mockRejectedValueOnce(new Error() as never)

      const promise = sut.decrypt('any_token')

      await expect(promise).rejects.toThrow()
    })
  })
})
