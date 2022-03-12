import { Collection } from 'mongodb'
import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-repository'

interface SutTypes {
  sut: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const sut = new LogMongoRepository()

  return { sut }
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const { sut } = makeSut()

    await sut.logError('any_error')

    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})