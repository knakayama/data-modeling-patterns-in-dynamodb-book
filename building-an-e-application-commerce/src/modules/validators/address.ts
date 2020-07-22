import { IAddress } from '@externals/drivers/database/customer-interfaces'
import { AddressDetail } from '@modules/validators/address-detail'
import { ValidateNested, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import 'reflect-metadata'

export class Address implements IAddress {
  @ValidateNested()
  @Type(() => AddressDetail)
  home!: AddressDetail

  @ValidateNested()
  @IsOptional()
  @Type(() => AddressDetail)
  business?: AddressDetail
}
