import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class CompareFieldValidator implements Validation {
  constructor (private readonly field: string, private readonly fieldTwoCompare) {}
  validate (input: any): Error | null {
    if (input[this.field] !== input[this.fieldTwoCompare]) {
      return new InvalidParamError(this.fieldTwoCompare)
    }
    return null
  }
}
