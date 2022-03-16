import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from './add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return { sut, addSurveyRepositoryStub }
}

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_qeustion',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }]
})
describe('DbAddSurvey UseCase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    await sut.add(makeFakeSurvey())

    expect(addSpy).toHaveBeenCalledWith(makeFakeSurvey())
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValue(new Error())

    const surveyData = makeFakeSurvey()
    const promise = sut.add(surveyData)

    await expect(promise).rejects.toThrowError(Error)
  })
})
