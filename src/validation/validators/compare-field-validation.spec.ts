import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldValidator } from './compare-field-validation'

interface SutTypes {
  sut: CompareFieldValidator
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldValidator('any_field', 'any_field_compare')

  return { sut }
}

describe('Required Field Validation', () => {
  test('Should return a InvalidParamError if Validation fails', () => {
    const { sut } = makeSut()

    const error = sut.validate({
      any_field: 'text',
      any_field_compare: 'text_diff'
    })

    expect(error).toEqual(new InvalidParamError('any_field_compare'))
  })

  test('Should return null if validation pass', () => {
    const { sut } = makeSut()

    const error = sut.validate({
      any_field: 'text',
      any_field_compare: 'text'
    })

    expect(error).toBeFalsy()
  })
})
