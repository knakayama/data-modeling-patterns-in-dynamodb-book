import { Matches, IsIn, IsNumber } from 'class-validator'
import { IOrderRequest } from '@externals/drivers/database/customer-interfaces'
import { OrderStatus } from '@externals/drivers/database/customer-interfaces'

export class OrderRequest implements IOrderRequest {
  @Matches(/^[a-z0-9]+$/i, {
    message: 'Please specify a valid user name!',
  })
  userName!: string

  @IsIn(['SHIPPED', 'CANCELED', 'PROCESSING'], {
    message: 'Please specify a valid email address!',
  })
  status!: OrderStatus

  @IsNumber({}, { message: 'Please specify a valid amount!' })
  amount!: number

  @IsNumber({}, { message: 'Please specify number items!' })
  numberItems!: number
}
