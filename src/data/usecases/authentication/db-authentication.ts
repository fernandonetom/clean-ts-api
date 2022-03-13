import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async auth (authenticationData: AuthenticationModel): Promise<string | null> {
    await this.loadAccountByEmailRepository.load(authenticationData.email)
    return null
  }
}
