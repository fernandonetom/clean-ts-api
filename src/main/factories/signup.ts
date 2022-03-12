import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../presentation/controllers/signup/SignUpController'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { BcryptAdapter } from '../../infra/encrypter/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decoratos/log'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)
  const signupController = new SignUpController(emailValidator, dbAddAccount)
  return new LogControllerDecorator(signupController)
}
