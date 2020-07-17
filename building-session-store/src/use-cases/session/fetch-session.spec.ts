import { ErrorCodes } from '@presenters/error-codes'
import {
  InternalServerErrorResult,
  NotFoundResult,
  ForbiddenResult,
} from '@presenters/errors'
import { SessionTableUtils } from '@test/utils/session-table-utils'
import { SessionFetchUseCase } from '@use-cases/session/fetch-session'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { Chance } from 'chance'
import { RequestUtils } from '@test/utils/request-utils'
import { Session } from '@externals/drivers/database/session-interfaces'

const chance = new Chance.Chance()

describe('SessionFetchUseCase', () => {
  const sessionDatabaseDriver = new SessionDatabaseDriver()
  const sessionFetchUseCase = new SessionFetchUseCase(sessionDatabaseDriver)

  describe('fetchSession', () => {
    describe('When an exception happens', () => {
      const userName = RequestUtils.generateUserName()
      const sessionToken = RequestUtils.generateSessionToken()
      const message = chance.string()

      test('should return Promise rejection', async () => {
        jest
          .spyOn(sessionDatabaseDriver, 'findSessionBySessionToken')
          .mockImplementationOnce(() => {
            throw new Error(message)
          })

        await sessionFetchUseCase
          .fetchSession(userName, sessionToken)
          .catch((error: InternalServerErrorResult) => {
            expect(error).toBeInstanceOf(InternalServerErrorResult)
            expect(error.code).toEqual(ErrorCodes.InternalServerError)
            expect(error.description).toEqual(message)
          })
      })
    })

    describe('When no session token specified', () => {
      const userName = RequestUtils.generateUserName()
      const sessionToken = RequestUtils.generateSessionToken()

      test('should return Promise rejection', async () => {
        jest
          .spyOn(sessionDatabaseDriver, 'findSessionBySessionToken')
          .mockResolvedValueOnce({} as Session)

        await sessionFetchUseCase
          .fetchSession(userName, sessionToken)
          .catch((error: NotFoundResult) => {
            expect(error).toBeInstanceOf(NotFoundResult)
            expect(error.code).toEqual(ErrorCodes.NotFound)
            expect(error.description).toInclude(sessionToken)
          })
      })
    })

    describe('When a user is not allowed to access to a session token', () => {
      const session = SessionTableUtils.generateSession()
      const userName = RequestUtils.generateUserName()
      const sessionToken = session.sessionToken

      test('should return Promise rejection', async () => {
        jest
          .spyOn(sessionDatabaseDriver, 'findSessionBySessionToken')
          .mockResolvedValueOnce(session)

        await sessionFetchUseCase
          .fetchSession(userName, sessionToken)
          .catch((error: ForbiddenResult) => {
            expect(error).toBeInstanceOf(ForbiddenResult)
            expect(error.code).toEqual(ErrorCodes.Forbidden)
            expect(error.description).toInclude(userName)
          })
      })
    })

    describe('When everthing is ok', () => {
      const session = SessionTableUtils.generateSession()
      const userName = session.userName
      const sessionToken = session.sessionToken

      test('should return a book', async () => {
        jest
          .spyOn(sessionDatabaseDriver, 'findSessionBySessionToken')
          .mockResolvedValueOnce(session)

        const actual = await sessionFetchUseCase.fetchSession(
          userName,
          sessionToken
        )
        expect(actual).toEqual(session)
      })
    })
  })
})
