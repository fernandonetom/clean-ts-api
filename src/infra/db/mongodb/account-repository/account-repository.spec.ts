import { AccountMongoRepository } from './account-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, Document } from 'mongodb'

interface SutTypes{
  sut: AccountMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new AccountMongoRepository()

  return { sut }
}

let collection: Collection

describe('Account mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('Should return an account add on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'any_name',
      email: 'email@mail.com',
      password: 'any_password'
    }

    await collection.insertOne(accountData)

    const account = await sut.loadByEmail(accountData.email)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(accountData.name)
    expect(account.email).toBe(accountData.email)
    expect(account.password).toBe(accountData.password)
  })

  test('Should return null of account not exists', async () => {
    const { sut } = makeSut()

    const account = await sut.loadByEmail('fake@email.com')

    expect(account).toBeNull()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'any_name',
      email: 'email@mail.com',
      password: 'any_password'
    }

    const { insertedId } = await collection.insertOne(accountData)

    const accountInserted = await collection.findOne({ _id: insertedId }) as Document
    expect(accountInserted.accessToken).toBeFalsy()

    await sut.updateAccessToken(insertedId.toHexString(), 'any_token')
    const account = await collection.findOne({ _id: insertedId })

    expect(account).toBeTruthy()
  })
})
