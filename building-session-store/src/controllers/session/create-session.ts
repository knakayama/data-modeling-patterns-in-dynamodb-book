import { UserValidator } from '@controllers/session/user-validator'
import { ErrorCodes } from '@presenters/error-codes'
import { ErrorResult } from '@presenters/errors'
import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { ResponseBuilder } from '@presenters/response-builder'
import { SessionCreationUseCase } from '@use-cases/session/create-session'
import { Logger } from '@modules/utils/logger'

export class SessionCreationController {
  constructor(
    private readonly _sessionCreationUseCase: SessionCreationUseCase
  ) {}

  createSession: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    const logger = Logger.getLogger()
    const userName = event?.pathParameters?.userName

    if (!userName) {
      ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a valid path parameter!',
        callback
      )
    }

    if (UserValidator.isInValidUserName(userName!)) {
      ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a valid user name!',
        callback
      )
    }

    this._sessionCreationUseCase
      .createSession(userName!)
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
