import { EmailValidation } from './email-validation'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../../presentation/errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes{
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(emailValidatorStub, 'email')

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({
      email: 'any_email@email.com'
    })

    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  it('Should return an error if emailValidation return false', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)

    const error = sut.validate({
      email: 'any_email@email.com'
    })

    expect(error)
      .toEqual(new InvalidParamError('email'))
  })

  it('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementation(() => {
        throw new Error()
      })

    expect(sut.validate)
      .toThrow()
  })
})
