import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('should return false if validator return false', () => {
    const emailValidatorAdapter = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValidEmail = emailValidatorAdapter.isValid('invalid@email.com')

    expect(isValidEmail).toBe(false)
  })
  test('should return true if validator return true', () => {
    const emailValidatorAdapter = makeSut()

    const isValidEmail = emailValidatorAdapter.isValid('valid@email.com')

    expect(isValidEmail).toBe(true)
  })
})
