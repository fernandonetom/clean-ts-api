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
  })
})
