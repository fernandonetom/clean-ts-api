import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/HttpHelpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) { return badRequest(new MissingParamError('email')) }

    return badRequest(new MissingParamError('password'))
  }
}
