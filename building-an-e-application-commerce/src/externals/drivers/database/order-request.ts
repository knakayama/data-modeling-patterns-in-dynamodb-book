import { Matches, IsIn } from 'class-validator'
import { IOrderRequest } from '@externals/drivers/database/customer-interfaces'

export class OrderRequest implements IOrderRequest {
  @Matches(/^[a-z0-9]+$/i, {
    message: 'Please specify a valid user name!',
  })
  userName!: string

  @IsIn(['SHIPPED', 'CANCELED', 'PROCESSING'], {
    message: 'Please specify a valid email address!',
  })
  status!: 'SHIPPED' | 'CANCELED' | 'PROCESSING'

  amount!: number

  numberItems!: number
}
