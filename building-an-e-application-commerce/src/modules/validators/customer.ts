import { IsEmail, ValidateNested, Matches } from 'class-validator'
import { ICustomer } from '@externals/drivers/database/customer-interfaces'
import { Type } from 'class-transformer'
import { Address } from '@modules/validators/address'
import 'reflect-metadata'

export class Customer implements ICustomer {
  @Matches(/^[a-z0-9]+$/i, {
    message: 'Please specify a valid customer name!',
  })
  customerName!: string

  @IsEmail(
    {},
    {
      message: 'Please specify a valid email address!',
    }
  )
  emailAddress!: string

  @Matches(/^[a-z0-9\s]+$/i, {
    message: 'Please specify a valid name!',
  })
  name!: string

  @ValidateNested()
  @Type(() => Address)
  address!: Address
}
