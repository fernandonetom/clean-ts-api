import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)

  return { sut, validationStub }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'Any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }
}

describe('Add Survey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validationSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
