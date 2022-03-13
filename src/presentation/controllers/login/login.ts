import { Authentication, Controller, HttpRequest, HttpResponse, EmailValidator } from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/HttpHelpers'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) { return badRequest(new MissingParamError('email')) }
      if (!password) { return badRequest(new MissingParamError('password')) }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      const credentials = await this.authentication.auth(email, password)

      if (!credentials) return unauthorized()

      return ok({ accessToken: credentials })
    } catch (error) {
      return serverError(error)
    }
  }
}
