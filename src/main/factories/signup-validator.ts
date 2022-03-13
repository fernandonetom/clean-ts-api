import { Validation } from '../../presentation/helpers/validators/validation'

export const makeSignUpValidator = (): Validation => {
  class SignUpValidator implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new SignUpValidator()
}
