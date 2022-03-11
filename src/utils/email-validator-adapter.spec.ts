import { EmailValidatorAdapter } from './email-validator-adapter'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('should return false if validator return false', () => {
    const emailValidatorAdapter = makeSut()

    const isValidEmail = emailValidatorAdapter.isValid('invalid@email.com')

    expect(isValidEmail).toBe(false)
  })
})
