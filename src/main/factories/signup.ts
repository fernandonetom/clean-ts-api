import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../presentation/controllers/signup/SignUpController'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { BcryptAdapter } from '../../infra/encrypter/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)
  return new SignUpController(emailValidator, dbAddAccount)
}
