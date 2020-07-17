import { SessionFetchController } from '@controllers/session/fetch-session'
import { SessionFetchUseCase } from '@use-cases/session/fetch-session'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { ApiInterceptor } from '@middlewares/api/interceptor'

const sessionDatabaseDriver = new SessionDatabaseDriver()
const sessionFetchUseCase = new SessionFetchUseCase(sessionDatabaseDriver)
const sessionFetchController = new SessionFetchController(sessionFetchUseCase)
const apiInterceptor = new ApiInterceptor(sessionFetchController.fetchSession)

export const fetchSession = apiInterceptor.intercept
