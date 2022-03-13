import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidator } from './signup-validator'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('Signup Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidator()

    const requiredValidation: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      requiredValidation.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toBeCalledWith(requiredValidation)
  })
})
