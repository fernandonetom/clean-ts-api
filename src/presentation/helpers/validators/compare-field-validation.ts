import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class CompareFieldValidator implements Validation {
  constructor (private readonly field: string, private readonly fieldTwoCompare) {}
  validate (input: any): Error | null {
    if (input[this.field] !== input[this.fieldTwoCompare]) {
      return new InvalidParamError(this.fieldTwoCompare)
    }
    return null
  }
}
