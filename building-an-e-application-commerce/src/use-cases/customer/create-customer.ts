import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { CusAndCusAddrTransactionDriver } from '@externals/drivers/database/customer-and-customer-address-transaction'
import { Logger } from '@modules/utils/logger'
import { Customer } from '@externals/drivers/database/customer'

export class CustomerCreationUseCase {
  constructor(
    private readonly _cusAndCusAddrTransactionDriver: CusAndCusAddrTransactionDriver
  ) {}

  async createCustomer(customer: Customer): Promise<void> {
    const logger = Logger.getLogger()
    try {
      await this._cusAndCusAddrTransactionDriver.createCustomer(customer)
    } catch (error) {
      logger.error(error)
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
