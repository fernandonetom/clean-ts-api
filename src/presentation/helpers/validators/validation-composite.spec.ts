import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
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
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])

  return { sut, validationStub }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: undefined })

    expect(error).toEqual(new MissingParamError('field'))
  })
})
