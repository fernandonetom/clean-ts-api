import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { makeAddSurveyValidator } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('Add Survey Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidator()

    const validations: Validation[] = []

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
