import { ValidatorUtils } from '@modules/utils/validator'
import { ErrorCodes } from '@presenters/error-codes'
import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { ResponseBuilder } from '@presenters/response-builder'
import { OrderPlacementUseCase } from '@use-cases/order/place-order'
import { Logger } from '@modules/utils/logger'
import { validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { OrderRequest } from '@modules/validators/order-request'
import { ControllerUtil } from '@modules/utils/controller-util'

export class OrderPlacementController {
  constructor(private readonly _orderPlacementUseCase: OrderPlacementUseCase) {}

  placeOrder: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    const customerName = event?.pathParameters?.customerName
    const requestBody = plainToClass(OrderRequest, {
      ...ControllerUtil.parseEvent<OrderRequest>(event.body),
      ...{
        customerName,
      },
    })

    validateOrReject(requestBody)
      .then(() => this._orderPlacementUseCase.placeOrder(requestBody))
      .then(() => ResponseBuilder.noContent(callback))
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
