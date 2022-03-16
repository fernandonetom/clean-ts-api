import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, Document } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'

interface SutTypes{
  sut: SurveyMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()

  return { sut }
}

let collection: Collection

describe('Survey mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    collection = await MongoHelper.getCollection('surveys')
    await collection.deleteMany({})
  })

  test('Should add a survey on success', async () => {
    const { sut } = makeSut()

    await sut.add({
      question: 'any_question',
      answers: [
        {
          answer: 'any_answer',
          image: 'any_image'
        },
        {
          answer: 'any_answer_without_image'
        }]
    })

    const survey = await collection.findOne({ question: 'any_question' }) as Document

    expect(survey).toBeTruthy()
    expect(survey.question).toBeTruthy()
    expect(survey.answers).toBeTruthy()
    expect(survey.answers.length).toBe(2)
  })
})
