import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidator = (): Validation => {
  const requiredValidation: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    requiredValidation.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(requiredValidation)
}
