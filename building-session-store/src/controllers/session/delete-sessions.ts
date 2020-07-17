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
import { SessionDeletionsUseCase } from '@use-cases/session/delete-sessions'
import { Logger } from '@modules/utils/logger'

export class SessionDeletionsController {
  constructor(
    private readonly _sessionDeletionsUseCase: SessionDeletionsUseCase
  ) {}

  deleteSessions: ApiHandler = (
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

    this._sessionDeletionsUseCase
      .deleteSessions(userName!)
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
