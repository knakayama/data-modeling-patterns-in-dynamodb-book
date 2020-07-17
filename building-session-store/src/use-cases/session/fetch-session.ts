import { ErrorCodes } from '@presenters/error-codes'
import {
  InternalServerErrorResult,
  NotFoundResult,
  ForbiddenResult,
} from '@presenters/errors'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { Logger } from '@modules/utils/logger'
import { Session } from '@externals/drivers/database/session-interfaces'
import { ValidatorUtils } from '@modules/utils/validator'

export class SessionFetchUseCase {
  constructor(private readonly _sessionDatabaseDriver: SessionDatabaseDriver) {}

  async fetchSession(userName: string, sessionToken: string): Promise<Session> {
    const logger = Logger.getLogger()
    let session: Session
    try {
      session = await this._sessionDatabaseDriver.findSessionBySessionToken(
        sessionToken
      )
    } catch (error) {
      logger.error(error)
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }

    if (ValidatorUtils.isEmptyObject(session)) {
      return Promise.reject(
        new NotFoundResult(ErrorCodes.NotFound, `${sessionToken} not found`)
      )
    }

    if (session.userName !== userName) {
      return Promise.reject(
        new ForbiddenResult(
          ErrorCodes.Forbidden,
          `${userName} can't access to this resource`
        )
      )
    }
    return session
  }
}
