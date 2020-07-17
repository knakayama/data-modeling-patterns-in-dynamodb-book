import { Chance } from 'chance'
import { v4 as uuidv4 } from 'uuid'

const chance: Chance.Chance = new Chance()

export class RequestUtils {
  static generateUserName(): string {
    return chance.string({ pool: 'abcde1234-' })
  }

  static generateSessionToken(): string {
    return uuidv4()
  }
}
