import { UserValidator } from '@controllers/session/user-validator'
import { ErrorCodes } from '@presenters/error-codes'
import {
  ErrorResult,
  NotFoundResult,
  ForbiddenResult,
} from '@presenters/errors'
import {
  ApiCallback,
  ApiContext,
  ApiEvent,
  ApiHandler,
} from '@presenters/interfaces'
import { ResponseBuilder } from '@presenters/response-builder'
import { SessionFetchUseCase } from '@use-cases/session/fetch-session'
import { Logger } from '@modules/utils/logger'
import { Session } from '@externals/drivers/database/session-interfaces'

export interface SessionResponse {
  session: Session
}

export class SessionFetchController {
  constructor(private readonly _sessionFetchUseCase: SessionFetchUseCase) {}

  fetchSession: ApiHandler = (
    event: ApiEvent,
    context: ApiContext,
    callback: ApiCallback
  ): void => {
    const logger = Logger.getLogger()
    const userName = event?.pathParameters?.userName
    const sessionToken = event?.pathParameters?.sessionToken

    if (!userName || !sessionToken) {
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

    if (UserValidator.isInValidSessionToken(sessionToken!)) {
      ResponseBuilder.badRequest(
        ErrorCodes.BadRequest,
        'Please specify a valid session token!',
        callback
      )
    }

    this._sessionFetchUseCase
      .fetchSession(userName!, sessionToken!)
      .then((session) => {
        const response: SessionResponse = {
          session,
        }
        ResponseBuilder.ok(response, callback)
      })
      .catch((error: ErrorResult) => {
        logger.error(error.description)

        if (error instanceof NotFoundResult) {
          ResponseBuilder.notFound(error.code, error.description, callback)
        }

        if (error instanceof ForbiddenResult) {
          ResponseBuilder.forbidden(error.code, error.description, callback)
        }
        ResponseBuilder.internalServerError(
          error.code,
          error.description,
          callback
        )
      })
  }
}
