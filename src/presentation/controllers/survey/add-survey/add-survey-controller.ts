import { ok, Controller, HttpRequest, HttpResponse, Validation, badRequest, AddSurvey, serverError } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      await this.addSurvey.add(httpRequest.body)

      return ok(null)
    } catch (error) {
      return serverError(error)
    }
  }
}
