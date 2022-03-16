import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}
  async decrypt (value: string): Promise<string> {
    jwt.verify(value, this.secret)
    return await Promise.resolve('')
  }

  async encrypt (payload: string): Promise<string> {
    return jwt.sign({ id: payload }, this.secret)
  }
}
