export class UserValidator {
  static isInValidUserName(something: string): boolean {
    return /[^a-z0-9-]+/i.test(something)
  }

  static isInValidSessionToken(something: string): boolean {
    return /[^a-z0-9-]+/i.test(something)
  }
}
