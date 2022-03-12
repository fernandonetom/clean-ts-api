import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL ?? '')
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('Should reconnect if mongo is down', async () => {
    let accountCollection = sut.getCollection('accounts')

    expect(accountCollection).toBeTruthy()
    accountCollection = sut.getCollection('accounts')
    await sut.disconnect()
    expect(accountCollection).toBeTruthy()
  })
})
