import { Chance } from 'chance'
import { UserRequest } from '@externals/drivers/database/customer-interfaces'

const chance: Chance.Chance = new Chance()

export class RequestUtils {
  static generateUserName(): string {
    return chance.string({ pool: 'abcde1234-' })
  }

  static generateName(): string {
    return chance.string({ pool: 'abcde1234-' })
  }

  static generateEmailAddress(): string {
    return chance.email()
  }

  static generateUserRequest(): UserRequest {
    return {
      userName: this.generateUserName(),
      emailAddress: this.generateEmailAddress(),
      name: this.generateName(),
    }
  }
}
