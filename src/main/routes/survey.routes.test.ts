import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let collection: Collection

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Should return 403 if not send a token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
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
        .expect(403)
    })

    // test('Should return an error with status correct status code', async () => {
    //   await request(app)
    //     .post('/api/signup')
    //     .send({
    //       name: 'Any Name',
    //       password: '123456',
    //       passwordConfirmation: '123456'
    //     })
    //     .expect(400)
    // })
  })
})
