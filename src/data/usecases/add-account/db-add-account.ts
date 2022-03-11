import { AddAccountRepository } from '../../protocols/add-account-repository'
import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly accountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.accountRepository.add({
      ...accountData,
      password: hashedPassword
    })
    return await Promise.resolve({ email: '', id: '', name: '', password: '' })
  }
}
