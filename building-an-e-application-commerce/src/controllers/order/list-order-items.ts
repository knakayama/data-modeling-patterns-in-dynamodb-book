import { ValidatorUtils } from '@modules/utils/validator'
import { ErrorCodes } from '@presenters/error-codes'
import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { ResponseBuilder } from '@presenters/response-builder'
import { OrderItemListingUseCase } from '@use-cases/order/list-order-items'
import { Logger } from '@modules/utils/logger'
import { validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { CustomerOrderItemRequest } from '@modules/validators/customer-order-item-request'
import { IOrderItemResponse } from '@externals/drivers/database/customer-interfaces'

export class OrderItemListingController {
  constructor(
    private readonly _orderItemListingUseCase: OrderItemListingUseCase
  ) {}

  listOrderItems: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    const customerOrderItemRequest = plainToClass(CustomerOrderItemRequest, {
      customerName: event?.pathParameters?.customerName,
      orderId: event?.pathParameters?.orderId,
    })

    validateOrReject(customerOrderItemRequest)
      .then(() =>
        this._orderItemListingUseCase.listOrderItems(customerOrderItemRequest)
      )
      .then((orderItem: IOrderItemResponse) =>
        ResponseBuilder.ok({ orderItem }, callback)
      )
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
