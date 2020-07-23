import { Matches, IsString } from 'class-validator'
import { ICustomerOrderItemRequest } from '@externals/drivers/database/customer-interfaces'

export class CustomerOrderItemRequest implements ICustomerOrderItemRequest {
  @Matches(/^[a-z0-9]+$/i, {
    message: 'Please specify a valid customer name!',
  })
  customerName!: string

  @IsString({ message: 'Please specify a valid order id!' })
  orderId!: string
}
