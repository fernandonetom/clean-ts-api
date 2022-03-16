import { CompareFieldValidator, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { makeSignUpValidator } from './signup-validator-factory'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('Signup Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidator()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldValidator('password', 'passwordConfirmation'))

    validations.push(new EmailValidation(makeEmailValidator(), 'email'))

    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
