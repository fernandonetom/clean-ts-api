import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidator } from './signup-validator-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeAddAccount } from '../../usecases/add-account/db-add-account'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(new SignUpController(
    makeAddAccount(),
    makeSignUpValidator(),
    makeDbAuthentication())
  )
}
