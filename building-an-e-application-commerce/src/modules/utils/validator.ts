export class ValidatorUtils {
  static isEmptyObject<T>(obj: T): boolean {
    return Object.entries(obj).length === 0
  }

  static isEmptyArray<T>(ary: T[]): boolean {
    return ary.length === 0
  }
}
