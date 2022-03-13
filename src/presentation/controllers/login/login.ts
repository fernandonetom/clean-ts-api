import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helpers'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, password } = httpRequest.body

      const credentials = await this.authentication
        .auth({ email, password })

      if (!credentials) return unauthorized()

      return ok({ accessToken: credentials })
    } catch (error) {
      return serverError(error)
    }
  }
}
