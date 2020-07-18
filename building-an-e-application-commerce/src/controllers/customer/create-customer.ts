import { UserValidator } from '@controllers/customer/customer-validator'
import { ValidatorUtils } from '@modules/utils/validator'
import { ErrorCodes } from '@presenters/error-codes'
import { ErrorResult } from '@presenters/errors'
import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { ResponseBuilder } from '@presenters/response-builder'
import { CustomerCreationUseCase } from '@use-cases/customer/create-customer'
import { Logger } from '@modules/utils/logger'
import { UserRequest } from '@externals/drivers/database/customer-interfaces'
import * as emailValidator from 'email-validator'

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
    const requestBody = JSON.parse(event?.body ?? '') as UserRequest

    if (
      ValidatorUtils.isEmptyObject(requestBody) ||
      !requestBody.userName ||
      !requestBody.emailAddress ||
      !requestBody.name
    ) {
      ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a valid request body!',
        callback
      )
    }

    if (UserValidator.isInValidUserName(requestBody.userName)) {
      ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a valid user name!',
        callback
      )
    }

    if (!emailValidator.validate(requestBody.emailAddress)) {
      ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a valid email address!',
        callback
      )
    }

    if (UserValidator.isInValidName(requestBody.name)) {
      ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a valid name!',
        callback
      )
    }

    this._customerCreationUseCase
      .createCustomer(requestBody)
      .then(() => {
        ResponseBuilder.noContent(callback)
      })
      .catch((error: ErrorResult) => {
        logger.error(error.description)
        ResponseBuilder.internalServerError(
          error.code,
          error.description,
          callback
        )
      })
  }
}
