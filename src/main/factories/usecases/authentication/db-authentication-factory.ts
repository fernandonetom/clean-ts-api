import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../../domain/usecases/authentication'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/encrypter/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/encrypter/jwt-adapter/jwt-adapter'
import env from '../../../config/env'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(
    accountMongoRepository,
    hashComparer,
    tokenGenerator,
    accountMongoRepository
  )
}
