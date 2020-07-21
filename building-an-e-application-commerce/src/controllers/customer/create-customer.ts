import { ValidatorUtils } from '@modules/utils/validator'
import { ErrorCodes } from '@presenters/error-codes'
import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { ResponseBuilder } from '@presenters/response-builder'
import { CustomerCreationUseCase } from '@use-cases/customer/create-customer'
import { Logger } from '@modules/utils/logger'
import { Customer } from '@externals/drivers/database/customer'
import { validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { ControllerUtil } from '@modules/utils/controller-util'

export class CustomerCreationController {
  constructor(
    private readonly _customerCreationUseCase: CustomerCreationUseCase
  ) {}

  createCustomer: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    const logger = Logger.getLogger()
    const requestBody = plainToClass(
      Customer,
      ControllerUtil.parseEvent<Customer>(event.body)
    )

    validateOrReject(requestBody)
      .then(() => this._customerCreationUseCase.createCustomer(requestBody))
      .then(() => ResponseBuilder.noContent(callback))
      .catch((error) => {
        logger.error(error)
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
