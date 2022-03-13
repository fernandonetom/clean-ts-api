import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let collection: Collection

describe('Login Routes', () => {
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

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)

      await collection.insertOne({
        name: 'any name',
        email: 'any@email.com',
        password: password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'any@email.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on non existing account', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any@email.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
