import { Matches } from 'class-validator'
import { ICustomerName } from '@externals/drivers/database/customer-interfaces'

export class CustomerName implements ICustomerName {
  @Matches(/^[a-z0-9]+$/i, {
    message: 'Please specify a valid customer name!',
  })
  customerName!: string
}
