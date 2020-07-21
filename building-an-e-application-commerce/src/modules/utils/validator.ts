import { ValidationError } from 'class-validator'
import { ErrorResult } from '@presenters/errors'

export class ValidatorUtils {
  static isEmptyObject<T>(obj: T): boolean {
    return Object.entries(obj).length === 0
  }

  static isEmptyArray<T>(ary: T[]): boolean {
    return ary.length === 0
  }

  static isValidationError(error: ValidationError[] | ErrorResult): boolean {
    return error instanceof Array
  }

  static stringify(validationErrors: ValidationError[]): string {
    console.log(validationErrors)
    return validationErrors.reduce((attr, cur) => {
      if (!this.isEmptyObject(cur.constraints)) {
        Object.values(cur.constraints!).forEach(
          (value) => (attr = attr.concat(`${value}\n`))
        )
      }
      return attr
    }, '')
  }
}
