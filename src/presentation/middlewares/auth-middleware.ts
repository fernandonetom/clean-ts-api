import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helpers'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { LoadAccountByToken } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const token = httpRequest.headers?.['x-access-token']
    await this.loadAccountByToken.load(token)
    return await Promise.resolve(forbidden(new AccessDeniedError()))
  }
}
