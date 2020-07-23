import { IsNumber, IsUUID, IsString } from 'class-validator'
import { IOrderItemRequest } from '@externals/drivers/database/customer-interfaces'
import 'reflect-metadata'

export class OrderItemRequest implements IOrderItemRequest {
  @IsUUID('4', { message: 'Please specify a valid item id!' })
  itemId!: string

  @IsString({
    message: 'Please specify a valid description!',
  })
  description!: string

  @IsNumber({}, { message: 'Please specify a valid price!' })
  price!: number
}
