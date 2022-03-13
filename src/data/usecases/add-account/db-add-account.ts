import { AddAccountRepository } from '../../protocols/db/add-account-repository'
import { AccountModel, AddAccount, AddAccountModel, Hasher } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly accountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.encrypt(accountData.password)
    const account = await this.accountRepository.add({
      ...accountData,
      password: hashedPassword
    })
    return account
  }
}
