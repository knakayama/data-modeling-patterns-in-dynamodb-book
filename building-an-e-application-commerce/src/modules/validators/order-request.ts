import {
  Matches,
  IsIn,
  IsNumber,
  ValidateNested,
  IsDefined,
} from 'class-validator'
import { IOrderRequest } from '@externals/drivers/database/customer-interfaces'
import { OrderStatus } from '@externals/drivers/database/customer-interfaces'
import { Type } from 'class-transformer'
import { OrderItemRequest } from '@modules/validators/order-item-request'
import 'reflect-metadata'

export class OrderRequest implements IOrderRequest {
  @Matches(/^[a-z0-9]+$/i, {
    message: 'Please specify a valid customer name!',
  })
  customerName!: string

  @IsIn(['SHIPPED', 'CANCELED', 'PROCESSING'], {
    message: 'Please specify a valid email address!',
  })
  status!: OrderStatus

  @IsNumber({}, { message: 'Please specify a valid amount!' })
  amount!: number

  @IsNumber({}, { message: 'Please specify number items!' })
  numberItems!: number

  @IsDefined()
  @ValidateNested()
  @Type(() => OrderItemRequest)
  orderItems!: OrderItemRequest[]
}
