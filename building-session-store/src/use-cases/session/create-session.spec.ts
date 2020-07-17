import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { SessionCreationUseCase } from '@use-cases/session/create-session'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { Chance } from 'chance'
import { RequestUtils } from '@test/utils/request-utils'

const chance = new Chance.Chance()

describe('SessionCreationUseCase', () => {
  const sessionDatabaseDriver = new SessionDatabaseDriver()
  const sessionCreationUseCase = new SessionCreationUseCase(
    sessionDatabaseDriver
  )

  describe('createSession', () => {
    describe('When an exception happens', () => {
      const userName = RequestUtils.generateUserName()
      const message = chance.string()

      test('should return Promise rejection', async () => {
        jest
          .spyOn(sessionDatabaseDriver, 'createSessionToken')
          .mockImplementationOnce(() => {
            throw new Error(message)
          })

        await sessionCreationUseCase
          .createSession(userName)
          .catch((error: InternalServerErrorResult) => {
            expect(error).toBeInstanceOf(InternalServerErrorResult)
            expect(error.code).toEqual(ErrorCodes.InternalServerError)
            expect(error.description).toEqual(message)
          })
      })
    })

    describe('When everthing is ok', () => {
      const userName = RequestUtils.generateUserName()

      test('should return a book', async () => {
        jest
          .spyOn(sessionDatabaseDriver, 'createSessionToken')
          .mockResolvedValueOnce()

        const actual = await sessionCreationUseCase.createSession(userName)
        expect(actual).toBeUndefined()
      })
    })
  })
})
