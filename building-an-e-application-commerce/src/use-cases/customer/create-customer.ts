import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { CusAndCusAddrTransactionDriver } from '@externals/drivers/database/customer-and-customer-address-transaction'
import { Logger } from '@modules/utils/logger'
import { UserRequest } from '@externals/drivers/database/customer-interfaces'

export class CustomerCreationUseCase {
  constructor(
    private readonly _cusAndCusAddrTransactionDriver: CusAndCusAddrTransactionDriver
  ) {}

  async createCustomer(user: UserRequest): Promise<void> {
    const logger = Logger.getLogger()
    try {
      await this._cusAndCusAddrTransactionDriver.createCustomer(user)
    } catch (error) {
      logger.error(error)
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
