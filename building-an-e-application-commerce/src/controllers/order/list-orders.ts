import { ValidatorUtils } from '@modules/utils/validator'
import { ErrorCodes } from '@presenters/error-codes'
import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { ResponseBuilder } from '@presenters/response-builder'
import { OrderListingUseCase } from '@use-cases/order/list-orders'
import { Logger } from '@modules/utils/logger'
import { validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { CustomerOrderRequest } from '@modules/validators/customer-order-request'
import { IOrder } from '@externals/drivers/database/customer-interfaces'

interface IOrderResponse {
  orders: IOrder[]
}

export class OrderListingController {
  constructor(private readonly _orderListingUseCase: OrderListingUseCase) {}

  listOrders: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    const customerName = plainToClass(CustomerOrderRequest, {
      customerName: event?.pathParameters?.customer,
    })

    validateOrReject(customerName)
      .then(() => this._orderListingUseCase.listOrders(customerName))
      .then((orders: IOrder[]) => {
        const response: IOrderResponse = {
          orders,
        }
        ResponseBuilder.ok(response, callback)
      })
      .catch((error) => {
        Logger.getLogger().error(error)
        if (ValidatorUtils.isValidationError(error)) {
          ResponseBuilder.badRequest(
            ErrorCodes.BadRequest,
            // TODO: more approprieate error message
            'Please check your request body!',
            callback
          )
        }
        ResponseBuilder.internalServerError(
          error.code,
          error.description,
          callback
        )
      })
  }
}
