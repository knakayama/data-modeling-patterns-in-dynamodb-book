import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { OrderAndItemTransactionDriver } from '@externals/drivers/database/order-and-item-transaction'
import { Logger } from '@modules/utils/logger'
import { OrderRequest } from '@modules/validators/order-request'

export class OrderPlacementUseCase {
  constructor(
    private readonly _orderAndItemTransactionDriver: OrderAndItemTransactionDriver
  ) {}

  async placeOrder(orderRequest: OrderRequest): Promise<void> {
    try {
      await this._orderAndItemTransactionDriver.placeOrder(orderRequest)
    } catch (error) {
      Logger.getLogger().error(error)
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
