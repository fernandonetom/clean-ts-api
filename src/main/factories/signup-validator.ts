import { CompareFieldValidator } from '../../presentation/helpers/validators/compare-field-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidator = (): Validation => {
  const requiredValidation: Validation[] = []
  const compareValidation: Validation[] = [
    new CompareFieldValidator('password', 'passwordConfirmation')
  ]

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    requiredValidation.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite([...requiredValidation, ...compareValidation])
}
