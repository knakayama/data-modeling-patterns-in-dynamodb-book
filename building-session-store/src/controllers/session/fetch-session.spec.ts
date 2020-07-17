import {
  SessionFetchController,
  SessionResponse,
} from '@controllers/session/fetch-session'
import { ErrorCodes } from '@presenters/error-codes'
import {
  BadRequestResult,
  ErrorResult,
  InternalServerErrorResult,
  NotFoundResult,
  ForbiddenResult,
} from '@presenters/errors'
import { ApiHandler } from '@presenters/interfaces'
import { HttpStatusCodes } from '@presenters/status-codes'
import {
  callFailureForParameter,
  callSuccessForParameter,
} from '@test/utils/caller'
import {
  ApiErrorResponseParsed,
  ApiResponseParsed,
  PathParameters,
} from '@test/utils/interfaces'
import { SessionFetchUseCase } from '@use-cases/session/fetch-session'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { Chance } from 'chance'
import { Session } from '@externals/drivers/database/session-interfaces'
import { RequestUtils } from '@test/utils/request-utils'

const chance = new Chance.Chance()

describe('FetchSessionController', () => {
  const sessionFetchUseCase = new SessionFetchUseCase(
    new SessionDatabaseDriver()
  )
  const sessionFetchController = new SessionFetchController(sessionFetchUseCase)

  async function callAndCheckError(
    handler: ApiHandler,
    expectedHttpStatusCode: number,
    errorResult: ErrorResult,
    pathParameter: PathParameters
  ): Promise<void> {
    const response: ApiErrorResponseParsed = await callFailureForParameter(
      handler,
      pathParameter
    )
    expect(response.statusCode).toBe(expectedHttpStatusCode)
    expect(response.parsedBody.error.code).toBe(errorResult.code)
    expect(response.parsedBody.error.description).toBe(errorResult.description)
  }

  describe('fetchSession', () => {
    describe('When there is no path parameters', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {}

        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid path parameter!'
        )
        await callAndCheckError(
          sessionFetchController.fetchSession,
          HttpStatusCodes.BadRequest,
          errorResult,
          pathParameters
        )
      })
    })

    describe('When a user name is missing', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          dummy: RequestUtils.generateUserName(),
          sessionToken: RequestUtils.generateSessionToken(),
        }
        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid path parameter!'
        )
        await callAndCheckError(
          sessionFetchController.fetchSession,
          HttpStatusCodes.BadRequest,
          errorResult,
          pathParameters
        )
      })
    })

    describe('When a session token is missing', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          userName: RequestUtils.generateUserName(),
          dummy: RequestUtils.generateSessionToken(),
        }
        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid path parameter!'
        )
        await callAndCheckError(
          sessionFetchController.fetchSession,
          HttpStatusCodes.BadRequest,
          errorResult,
          pathParameters
        )
      })
    })

    describe('When no session token specified', () => {
      const message = chance.string()
      test('should return Not Found Error', async () => {
        const pathParameters: PathParameters = {
          userName: RequestUtils.generateUserName(),
          sessionToken: RequestUtils.generateSessionToken(),
        }
        const errorResult = new NotFoundResult(ErrorCodes.NotFound, message)
        jest
          .spyOn(sessionFetchUseCase, 'fetchSession')
          .mockRejectedValueOnce(
            new NotFoundResult(ErrorCodes.NotFound, message)
          )

        await callAndCheckError(
          sessionFetchController.fetchSession,
          HttpStatusCodes.NotFound,
          errorResult,
          pathParameters
        )
      })
    })

    describe('When a user is not allowed to access to a session token', () => {
      const message = chance.string()
      test('should return Forbidden Error', async () => {
        const pathParameters: PathParameters = {
          userName: RequestUtils.generateUserName(),
          sessionToken: RequestUtils.generateSessionToken(),
        }
        const errorResult = new ForbiddenResult(ErrorCodes.Forbidden, message)
        jest
          .spyOn(sessionFetchUseCase, 'fetchSession')
          .mockRejectedValueOnce(
            new ForbiddenResult(ErrorCodes.Forbidden, message)
          )

        await callAndCheckError(
          sessionFetchController.fetchSession,
          HttpStatusCodes.Forbidden,
          errorResult,
          pathParameters
        )
      })
    })

    describe('When unexpected internal situations', () => {
      const message = chance.string()
      test('should return Internal Server Error', async () => {
        const pathParameters: PathParameters = {
          userName: RequestUtils.generateUserName(),
          sessionToken: RequestUtils.generateSessionToken(),
        }
        const errorResult = new InternalServerErrorResult(
          ErrorCodes.InternalServerError,
          message
        )
        jest
          .spyOn(sessionFetchUseCase, 'fetchSession')
          .mockRejectedValueOnce(
            new InternalServerErrorResult(
              ErrorCodes.InternalServerError,
              message
            )
          )

        await callAndCheckError(
          sessionFetchController.fetchSession,
          HttpStatusCodes.InternalServerError,
          errorResult,
          pathParameters
        )
      })
    })

    describe('When a user name is not valid', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          userName: 'invalid-user-name!',
          sessionToken: RequestUtils.generateSessionToken(),
        }
        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid user name!'
        )

        await callAndCheckError(
          sessionFetchController.fetchSession,
          HttpStatusCodes.BadRequest,
          errorResult,
          pathParameters
        )
      })
    })

    describe('When a session token is not valid', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          userName: RequestUtils.generateUserName(),
          sessionToken: 'invalid-session-token!',
        }
        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid session token!'
        )

        await callAndCheckError(
          sessionFetchController.fetchSession,
          HttpStatusCodes.BadRequest,
          errorResult,
          pathParameters
        )
      })
    })

    describe('When it suceeds', () => {
      test('should return 202', async () => {
        const pathParameters: PathParameters = {
          userName: RequestUtils.generateUserName(),
          sessionToken: RequestUtils.generateSessionToken(),
        }
        const session: Session = {
          createdAt: chance.date().toISOString(),
          expiresAt: chance.date().toISOString(),
          sessionToken: RequestUtils.generateSessionToken(),
          tTL: chance.second(),
          userName: RequestUtils.generateUserName(),
        }
        jest
          .spyOn(sessionFetchUseCase, 'fetchSession')
          .mockResolvedValue(session)

        const actualResponse: ApiResponseParsed<SessionResponse> = await callSuccessForParameter<
          SessionResponse
        >(sessionFetchController.fetchSession, pathParameters)
        expect(actualResponse.statusCode).toBe(HttpStatusCodes.OK)
        expect(actualResponse.parsedBody.session).toEqual(session)
      })
    })
  })
})
