import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { BcryptAdapter } from '../../../infra/encrypter/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decoratos/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeSignUpValidator } from './signup-validator-factory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)
  const signupValidator = makeSignUpValidator()
  const signupController = new SignUpController(dbAddAccount, signupValidator)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
