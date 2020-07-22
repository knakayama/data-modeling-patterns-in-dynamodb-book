import { MinLength, Length } from 'class-validator'
import { IAddressDetail } from '@externals/drivers/database/customer-interfaces'
import 'reflect-metadata'

export class AddressDetail implements IAddressDetail {
  @MinLength(1, {
    message: 'Please specify a valid street!',
  })
  street!: string

  @MinLength(1, {
    message: 'Please specify a valid city!',
  })
  city!: string

  @Length(2, 2, {
    message: 'Please specify a valid state!',
  })
  state!: string
}
