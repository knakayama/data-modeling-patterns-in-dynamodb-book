export class CustomerValidator {
  static isInValidCustomerName(something: string): boolean {
    return /[^a-z0-9-]+/i.test(something)
  }

  static isInValidName(something: string): boolean {
    return /[^a-z0-9-]+/i.test(something)
  }
}
