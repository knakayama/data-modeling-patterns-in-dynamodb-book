import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult, NotFoundResult } from '@presenters/errors'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { Logger } from '@modules/utils/logger'

export class SessionDeletionsUseCase {
  constructor(private readonly _sessionDatabaseDriver: SessionDatabaseDriver) {}

  async deleteSessions(userName: string): Promise<void> {
    const logger = Logger.getLogger()
    try {
      await this._sessionDatabaseDriver.deleteSessionTokensByUserName(userName)
    } catch (error) {
      logger.error(error)

      if (error instanceof NotFoundResult) {
        throw new NotFoundResult(error.code, error.message)
      }

      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
