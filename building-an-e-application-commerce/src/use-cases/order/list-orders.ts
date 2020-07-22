import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { CustomerDatabaseDriver } from '@externals/drivers/database/customer-table'
import { Logger } from '@modules/utils/logger'
import { CustomerName } from '@modules/validators/customer-name'
import { IOrder } from '@externals/drivers/database/customer-interfaces'

export class OrderListingUseCase {
  constructor(
    private readonly _customerDatabaseDriver: CustomerDatabaseDriver
  ) {}

  async listOrders(customerName: CustomerName): Promise<IOrder[]> {
    try {
      return this._customerDatabaseDriver.findOrdersByCustomerName(customerName)
    } catch (error) {
      Logger.getLogger().error(error)
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
