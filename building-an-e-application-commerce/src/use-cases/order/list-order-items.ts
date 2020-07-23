import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult, NotFoundResult } from '@presenters/errors'
import { CustomerDatabaseDriver } from '@externals/drivers/database/customer-table'
import { Logger } from '@modules/utils/logger'
import { CustomerOrderItemRequest } from '@modules/validators/customer-order-item-request'
import { IOrderItemResponse } from '@externals/drivers/database/customer-interfaces'

export class OrderItemListingUseCase {
  constructor(
    private readonly _customerDatabaseDriver: CustomerDatabaseDriver
  ) {}

  async listOrderItems(
    customerOrderItemRequest: CustomerOrderItemRequest
  ): Promise<IOrderItemResponse> {
    try {
      return {
        orderItems: await this._customerDatabaseDriver.findOrderItemsByOrderId(
          customerOrderItemRequest.orderId
        ),
        ...(await this._customerDatabaseDriver.findOrderByCustomerName(
          customerOrderItemRequest
        )),
      }
    } catch (error) {
      Logger.getLogger().error(error)

      if (error instanceof NotFoundResult) {
        throw new NotFoundResult(error.code, error.description)
      }
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
