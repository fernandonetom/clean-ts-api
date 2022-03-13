import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

interface SutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('any_field')

  return { sut }
}

describe('Required Field Validation', () => {
  test('Should return a MissingParamError if Validation fails', () => {
    const { sut } = makeSut()

    const error = sut.validate({})

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should return null if Validation pass', () => {
    const { sut } = makeSut()

    const error = sut.validate({ any_field: 'is_valid' })

    expect(error).toBeFalsy()
  })
})
