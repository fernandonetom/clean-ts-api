import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { BcryptAdapter } from '../../../infra/encrypter/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/encrypter/jwt-adapter/jwt-adapter'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decoratos/log-controller-decorator'
import { makeLoginValidator } from './login-validation-factory'
import env from '../../config/env'
export const makeLoginController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(
    accountMongoRepository,
    hashComparer,
    tokenGenerator,
    accountMongoRepository
  )

  const validation = makeLoginValidator()
  const loginController = new LoginController(authentication, validation)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logMongoRepository)
}
