export class EmailInUseError extends Error {
  constructor () {
    super('This email already in use')
    this.name = 'EmailInUseError'
  }
}
