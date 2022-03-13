import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    constructor (private readonly field: string) {}
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub('field')
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: undefined })

    expect(error).toEqual(new MissingParamError('field'))
  })
  test('Should return the first error if more then one validation', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'error' })

    expect(error).toEqual(new Error())
  })
  test('Should return null if all validations pass', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'valid_value' })

    expect(error).toBeFalsy()
  })
})
