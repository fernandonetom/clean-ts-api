import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helpers'
import { LoadAccountByToken, HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const token = httpRequest.headers?.['x-access-token']
      if (token) {
        const account = await this
          .loadAccountByToken.load(token, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
