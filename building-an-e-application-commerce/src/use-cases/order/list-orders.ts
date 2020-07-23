import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { CustomerDatabaseDriver } from '@externals/drivers/database/customer-table'
import { Logger } from '@modules/utils/logger'
import { CustomerOrderRequest } from '@modules/validators/customer-order-request'
import { IOrderResponse } from '@externals/drivers/database/customer-interfaces'

export class OrderListingUseCase {
  constructor(
    private readonly _customerDatabaseDriver: CustomerDatabaseDriver
  ) {}

  async listOrders(
    customerOrderRequest: CustomerOrderRequest
  ): Promise<IOrderResponse[]> {
    try {
      return this._customerDatabaseDriver.findOrdersByCustomerName(
        customerOrderRequest
      )
    } catch (error) {
      Logger.getLogger().error(error)
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
