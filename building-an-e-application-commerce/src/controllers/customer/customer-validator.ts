export class UserValidator {
  static isInValidUserName(something: string): boolean {
    return /[^a-z0-9-]+/i.test(something)
  }

  static isInValidName(something: string): boolean {
    return /[^a-z0-9-]+/i.test(something)
  }
}
