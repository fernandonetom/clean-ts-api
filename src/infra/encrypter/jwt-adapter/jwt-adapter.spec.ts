import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign: async () => 'token'
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
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

  test('Should return a token on sign success', async () => {
    const sut = makeSut()

    jest.spyOn(jwt, 'sign').mockRejectedValueOnce(new Error() as never)

    const promise = sut.encrypt('any_value')

    await expect(promise).rejects.toThrow()
  })
})
