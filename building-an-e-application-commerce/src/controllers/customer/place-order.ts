import { ValidatorUtils } from '@modules/utils/validator'
import { ErrorCodes } from '@presenters/error-codes'
import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { ResponseBuilder } from '@presenters/response-builder'
import { OrderPlacementUseCase } from '@use-cases/customer/place-order'
import { Logger } from '@modules/utils/logger'
import { validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { OrderRequest } from '@externals/drivers/database/order-request'
import { ControllerUtil } from '@modules/utils/controller-util'

export class OrderPlacementController {
  constructor(private readonly _orderPlacementUseCase: OrderPlacementUseCase) {}

  placeOrder: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    const requestBody = plainToClass(
      OrderRequest,
      ControllerUtil.parseEvent<OrderRequest>(event.body)
    )

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
