import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Any Name',
          email: 'email@any.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
    })

    test('Should return an error with status correct status code', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Any Name',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(400)
    })
  })
})
