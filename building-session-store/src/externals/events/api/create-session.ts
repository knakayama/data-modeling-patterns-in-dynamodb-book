import { SessionCreationController } from '@controllers/session/create-session'
import { SessionCreationUseCase } from '@use-cases/session/create-session'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { ApiInterceptor } from '@middlewares/api/interceptor'

const sessionDatabaseDriver = new SessionDatabaseDriver()
const sessionCreationUseCase = new SessionCreationUseCase(sessionDatabaseDriver)
const sessionCreationController = new SessionCreationController(
  sessionCreationUseCase
)
const apiInterceptor = new ApiInterceptor(
  sessionCreationController.createSession
)

export const createSession = apiInterceptor.intercept
