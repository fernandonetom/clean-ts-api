import { MissingParamError } from '../errors/MissingParamError'
import { SignUpController } from './SignUpController'

describe('SignUp Controller', () => {
  it('Should return 400 when name is not provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: undefined,
        email: 'any_email@email.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  it('Should return 400 when email is not provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'any name',
        email: undefined,
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
