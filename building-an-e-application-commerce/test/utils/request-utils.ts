import { Chance } from 'chance'
import { Address } from '@externals/drivers/database/address'
import { Customer } from '@externals/drivers/database/customer'
import {
  OrderStatus,
  IOrderRequestBody,
} from '@externals/drivers/database/customer-interfaces'

const chance: Chance.Chance = new Chance()

export class RequestUtils {
  static generateStatus(): OrderStatus {
    return ['SHIPPED', 'CANCELED', 'PROCESSING'][
      chance.integer({ min: 0, max: 2 })
    ] as OrderStatus
  }

  static generateCustomerName(): string {
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
      customerName: this.generateCustomerName(),
      emailAddress: this.generateEmailAddress(),
      name: this.generateName(),
      address: this.generateAddress(withBusiness),
    }
  }

  static generateOrderRequestBody(): IOrderRequestBody {
    return {
      status: this.generateStatus(),
      amount: chance.integer(),
      numberItems: chance.integer(),
    }
  }
}
