import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}
  decrypt: (value: string) => Promise<string>

  async encrypt (payload: string): Promise<string> {
    return jwt.sign({ id: payload }, this.secret)
  }
}
