import { Chance } from 'chance'
import { Address } from '@modules/validators/address'
import { Customer } from '@modules/validators/customer'
import {
  OrderStatus,
  IOrderRequestBody,
} from '@externals/drivers/database/customer-interfaces'
import { ItemRequest } from '@modules/validators/item-request'
import { v4 as uuidv4 } from 'uuid'

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

  static generateItemRequest(): ItemRequest {
    return {
      description: chance.paragraph(),
      itemId: uuidv4(),
      price: chance.integer(),
    }
  }

  static generateItemRequests(itemCount: number): ItemRequest[] {
    const items: ItemRequest[] = []
    for (let i: number = itemCount; i > 0; i -= 1) {
      items.push(this.generateItemRequest())
    }
    return items
  }

  static generateOrderRequestBody(itemCount = 1): IOrderRequestBody {
    return {
      status: this.generateStatus(),
      amount: chance.integer(),
      numberItems: chance.integer(),
      items: this.generateItemRequests(itemCount),
    }
  }
}
