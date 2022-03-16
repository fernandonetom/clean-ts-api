import { CompareFieldValidator, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helpers/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export const makeSignUpValidator = (): Validation => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldValidator('password', 'passwordConfirmation'))

  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))

  return new ValidationComposite(validations)
}