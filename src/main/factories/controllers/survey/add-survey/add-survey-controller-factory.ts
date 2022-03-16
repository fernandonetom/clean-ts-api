import { Controller } from '../../../../../presentation/protocols'
import { makeAddSurveyValidator } from './add-survey-validation-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSurvey } from '../../../usecases/survey/add-survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const surveyController = new AddSurveyController(
    makeAddSurveyValidator(),
    makeAddSurvey()
  )

  return makeLogControllerDecorator(surveyController)
}
