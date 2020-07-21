import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { CustomerDatabaseDriver } from '@externals/drivers/database/customer-table'
import { Logger } from '@modules/utils/logger'
import { OrderRequest } from '@externals/drivers/database/order-request'

export class OrderPlacementUseCase {
  constructor(
    private readonly _customerDatabaseDriver: CustomerDatabaseDriver
  ) {}

  async placeOrder(orderRequest: OrderRequest): Promise<void> {
    try {
      await this._customerDatabaseDriver.placeOrder(orderRequest)
    } catch (error) {
      Logger.getLogger().error(error)
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
