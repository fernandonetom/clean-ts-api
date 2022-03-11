import request from 'supertest'
import app from '../config/app'

describe('CORS middleware', () => {
  test('Should enable cors', async () => {
    app.post('/test_body_parse', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/test_body_parse')
      .send({ name: 'test' })
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
