import { SessionDeletionsController } from '@controllers/session/delete-sessions'
import { SessionDeletionsUseCase } from '@use-cases/session/delete-sessions'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { ApiInterceptor } from '@middlewares/api/interceptor'

const sessionDatabaseDriver = new SessionDatabaseDriver()
const sessionDeletionsUseCase = new SessionDeletionsUseCase(
  sessionDatabaseDriver
)
const sessionDeletionsController = new SessionDeletionsController(
  sessionDeletionsUseCase
)
const apiInterceptor = new ApiInterceptor(
  sessionDeletionsController.deleteSessions
)

export const deleteSessions = apiInterceptor.intercept
