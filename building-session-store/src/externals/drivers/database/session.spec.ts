import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { SessionTableUtils } from '@test/utils/session-table-utils'
import { RequestUtils } from '@test/utils/request-utils'
import { ObjectKeyMapper } from '@test/utils/object-key-mapper'
import { Chance } from 'chance'
import * as dayjs from 'dayjs'

const chance = new Chance.Chance()

process.env.SESSION_TABLE = 'Session'
process.env.USER_NAME = 'UserName'

describe('SessionDatabaseDriver', () => {
  const sessionTableUtils = new SessionTableUtils(process.env.SESSION_TABLE!)
  const sessionDatabaseDriver = new SessionDatabaseDriver(
    sessionTableUtils.dynamoDBD
  )

  describe('createSession', () => {
    const itemCount = 1
    beforeEach(async () => {
      await sessionTableUtils.createTable()
    })

    afterEach(async () => {
      await sessionTableUtils.deleteTable()
    })

    describe('When everything is ok', () => {
      const userName = RequestUtils.generateUserName()
      test('should create a session', async () => {
        await sessionDatabaseDriver.createSessionToken(userName)
        const actual = await sessionTableUtils.findSessions()

        expect(actual.length).toBe(itemCount)
        expect(actual[0].userName).toBe(userName)
      })
    })
  })

  describe('findSessionBySessionToken', () => {
    describe('When an item does not expire', () => {
      const sessions = SessionTableUtils.generateSessions()
      beforeEach(async () => {
        await sessionTableUtils.createTable()
        await sessionTableUtils.batchWriteItems(
          ObjectKeyMapper.toCapitalKeys(sessions)
        )
      })

      afterEach(async () => {
        await sessionTableUtils.deleteTable()
      })

      test('should return a session', async () => {
        const actual = await sessionDatabaseDriver.findSessionBySessionToken(
          sessions[0].sessionToken
        )

        expect(actual).toStrictEqual(sessions[0])
      })
    })

    describe('When an item expires', () => {
      const sessions = SessionTableUtils.generateSessions()
      sessions[0].tTL = dayjs().add(1, 'day').unix()
      beforeEach(async () => {
        await sessionTableUtils.createTable()
        await sessionTableUtils.batchWriteItems(
          ObjectKeyMapper.toCapitalKeys(sessions)
        )
      })

      afterEach(async () => {
        await sessionTableUtils.deleteTable()
      })

      test('should not return a session', async () => {
        const actual = await sessionDatabaseDriver.findSessionBySessionToken(
          sessions[0].sessionToken
        )

        expect(actual).toBeUndefined()
      })
    })
  })

  describe('deleteSessionTokensByUserName', () => {
    describe('When no session tokens', () => {
      const sessions = SessionTableUtils.generateSessions()
      beforeEach(async () => {
        await sessionTableUtils.createTable()
      })

      afterEach(async () => {
        await sessionTableUtils.deleteTable()
      })

      test('should return an error telling no session tokens', async () => {
        try {
          await sessionDatabaseDriver.deleteSessionTokensByUserName(
            sessions[0].userName
          )
        } catch (error) {
          expect(error.message).toInclude('does not')
        }
      })
    })

    describe('When a user does not have any session token', () => {
      const sessions = SessionTableUtils.generateSessions()
      beforeEach(async () => {
        await sessionTableUtils.createTable()
        await sessionTableUtils.batchWriteItems(
          ObjectKeyMapper.toCapitalKeys(sessions)
        )
      })

      afterEach(async () => {
        await sessionTableUtils.deleteTable()
      })

      sessions[0].userName = chance.string()
      test('should return an error telling no session tokens for the user', async () => {
        try {
          await sessionDatabaseDriver.deleteSessionTokensByUserName(
            sessions[0].userName
          )
        } catch (error) {
          expect(error.message).toBe('Not Found')
        }
      })
    })

    describe('When a user has a session token', () => {
      const sessions = SessionTableUtils.generateSessions()
      beforeEach(async () => {
        await sessionTableUtils.createTable()
        await sessionTableUtils.batchWriteItems(
          ObjectKeyMapper.toCapitalKeys(sessions)
        )
      })

      afterEach(async () => {
        await sessionTableUtils.deleteTable()
      })

      test('should delete the token', async () => {
        await sessionDatabaseDriver.deleteSessionTokensByUserName(
          sessions[0].userName
        )
        const actual = await sessionTableUtils.findSessions()

        expect(actual.length).toBe(0)
      })
    })

    describe('When a user has session tokens', () => {
      const itemCount = 3
      const sessions = SessionTableUtils.generateSessions(itemCount)

      beforeEach(async () => {
        await sessionTableUtils.createTable()
        await sessionTableUtils.batchWriteItems(
          ObjectKeyMapper.toCapitalKeys(sessions)
        )
      })

      afterEach(async () => {
        await sessionTableUtils.deleteTable()
      })

      test('should delete the tokens', async () => {
        await sessionDatabaseDriver.deleteSessionTokensByUserName(
          sessions[0].userName
        )
        const actual = await sessionTableUtils.findSessions()
        console.log(`actual: ${JSON.stringify(actual)}`)

        expect(actual.length).toBe(0)
      })
    })
  })
})
