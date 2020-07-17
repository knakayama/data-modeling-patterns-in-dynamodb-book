import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { Logger } from '@modules/utils/logger'

export class SessionCreationUseCase {
  constructor(private readonly _userDatabaseDriver: SessionDatabaseDriver) {}

  async createSession(userName: string): Promise<void> {
    const logger = Logger.getLogger()
    try {
      await this._userDatabaseDriver.createSessionToken(userName)
    } catch (error) {
      logger.error(error)
      throw new InternalServerErrorResult(
        ErrorCodes.InternalServerError,
        error.message
      )
    }
  }
}
