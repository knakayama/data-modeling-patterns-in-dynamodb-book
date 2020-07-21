import { Chance } from 'chance'
import { Address } from '@externals/drivers/database/address'
import { Customer } from '@externals/drivers/database/customer'

const chance: Chance.Chance = new Chance()

export class RequestUtils {
  static generateUserName(): string {
    return chance.name().split(' ').join('').toLowerCase()
}

  static generateName(): string {
    return chance.name()
  }

  static generateEmailAddress(): string {
    return chance.email()
  }

  static generateAddress(withBusiness: boolean): Address {
    const address = {
      home: {
        street: chance.street(),
        city: chance.street_suffix().abbreviation,
        state: chance.state(),
      },
    }
    return withBusiness
      ? {
          ...address,
          ...{
            business: {
              street: chance.street(),
              city: chance.street_suffix().abbreviation,
              state: chance.state(),
            },
          },
        }
      : address
  }

  static generateCustomer(withBusiness = false): Customer {
    return {
      userName: this.generateUserName(),
      emailAddress: this.generateEmailAddress(),
      name: this.generateName(),
      address: this.generateAddress(withBusiness),
    }
  }
}
