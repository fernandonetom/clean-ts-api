import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { Validation } from '../../../../../presentation/protocols/validation'
import { makeLoginValidator } from './login-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidator()

    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation(makeEmailValidator(), 'email'))

    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
