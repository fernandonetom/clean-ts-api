import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly accountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const findAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (findAccount) return null as unknown as AccountModel

    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.accountRepository.add({
      ...accountData,
      password: hashedPassword
    })
    return account
  }
}
