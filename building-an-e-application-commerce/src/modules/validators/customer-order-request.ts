import { Matches } from 'class-validator'
import { ICustomerOrderRequest } from '@externals/drivers/database/customer-interfaces'

export class CustomerOrderRequest implements ICustomerOrderRequest {
  @Matches(/^[a-z0-9]+$/i, {
    message: 'Please specify a valid customer name!',
  })
  customerName!: string
}
