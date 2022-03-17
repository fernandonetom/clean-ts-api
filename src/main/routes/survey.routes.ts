import { RequestHandler, Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeMakeAuthMiddleware } from '../factories/middlewares/add-survey-controller-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeMakeAuthMiddleware())
  router.post('/surveys',
    adminAuth as RequestHandler,
    adaptRoute(makeAddSurveyController()) as RequestHandler)
}
