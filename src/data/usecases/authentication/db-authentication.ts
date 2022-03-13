import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (authenticationData: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authenticationData.email)
    if (account) {
      await this.hashComparer.compare(authenticationData.password, account.password)
    }
    return null
  }
}
