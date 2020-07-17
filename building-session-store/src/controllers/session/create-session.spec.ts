import { SessionCreationController } from '@controllers/session/create-session'
import { ErrorCodes } from '@presenters/error-codes'
import {
  BadRequestResult,
  ErrorResult,
  InternalServerErrorResult,
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
import { SessionCreationUseCase } from '@use-cases/session/create-session'
import { SessionDatabaseDriver } from '@externals/drivers/database/session'
import { Chance } from 'chance'
import { RequestUtils } from '@test/utils/request-utils'

const chance = new Chance.Chance()

describe('SessionCreationController', () => {
  const sessionCreationUseCase = new SessionCreationUseCase(
    new SessionDatabaseDriver()
  )
  const sessionCreationController = new SessionCreationController(
    sessionCreationUseCase
  )

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

  describe('createSession', () => {
    describe('When there is no path parameters', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {}

        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid path parameter!'
        )
        await callAndCheckError(
          sessionCreationController.createSession,
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
        }
        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid path parameter!'
        )
        await callAndCheckError(
          sessionCreationController.createSession,
          HttpStatusCodes.BadRequest,
          errorResult,
          pathParameters
        )
      })
    })

    describe('Unexpected internal situations', () => {
      const message = chance.string()
      test('should return Internal Server Error', async () => {
        const pathParameters: PathParameters = {
          userName: RequestUtils.generateUserName(),
        }
        const errorResult = new InternalServerErrorResult(
          ErrorCodes.InternalServerError,
          message
        )
        jest
          .spyOn(sessionCreationUseCase, 'createSession')
          .mockRejectedValueOnce(
            new InternalServerErrorResult(
              ErrorCodes.InternalServerError,
              message
            )
          )

        await callAndCheckError(
          sessionCreationController.createSession,
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
        }
        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid user name!'
        )

        await callAndCheckError(
          sessionCreationController.createSession,
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
        }
        jest.spyOn(sessionCreationUseCase, 'createSession').mockResolvedValue()

        const actualResponse: ApiResponseParsed<unknown> = await callSuccessForParameter<
          unknown
        >(sessionCreationController.createSession, pathParameters)
        expect(actualResponse.statusCode).toBe(HttpStatusCodes.NoContent)
        expect(actualResponse.parsedBody).toBeEmpty()
      })
    })
  })
})
