import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authenticationData: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authenticationData.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authenticationData.password, account.password)
      if (isValid) {
        const token = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, token)
        return token
      }
    }
    return null
  }
}
