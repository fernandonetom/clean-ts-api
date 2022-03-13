import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (payload: string): Promise<string> {
    return jwt.sign({ id: payload }, this.secret)
  }
}
