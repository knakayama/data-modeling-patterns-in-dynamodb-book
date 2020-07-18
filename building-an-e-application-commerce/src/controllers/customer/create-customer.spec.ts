import { CustomerCreationController } from '@controllers/customer/create-customer'
import { ErrorCodes } from '@presenters/error-codes'
import {
  BadRequestResult,
  ErrorResult,
  InternalServerErrorResult,
} from '@presenters/errors'
import { ApiHandler } from '@presenters/interfaces'
import { HttpStatusCodes } from '@presenters/status-codes'
import {
  callFailureForRequestBody,
  callSuccessForRequestBody,
} from '@test/utils/caller'
import { ApiResponseParsed } from '@test/utils/interfaces'
import { CustomerCreationUseCase } from '@use-cases/customer/create-customer'
import { CusAndCusAddrTransactionDriver } from '@externals/drivers/database/customer-and-customer-address-transaction'
import { Chance } from 'chance'
import { RequestUtils } from '@test/utils/request-utils'
import { UserRequest } from '@externals/drivers/database/customer-interfaces'

const chance = new Chance.Chance()

describe('CustomerCreationController', () => {
  const customerCreationUseCase = new CustomerCreationUseCase(
    new CusAndCusAddrTransactionDriver()
  )
  const customerCreationController = new CustomerCreationController(
    customerCreationUseCase
  )

  async function callAndCheckError(
    handler: ApiHandler,
    expectedHttpStatusCode: number,
    errorResult: ErrorResult,
    requestBody: UserRequest
  ): Promise<void> {
    const response = await callFailureForRequestBody(handler, requestBody)

    expect(response.statusCode).toBe(expectedHttpStatusCode)
    expect(response.parsedBody.error.code).toBe(errorResult.code)
    expect(response.parsedBody.error.description).toBe(errorResult.description)
  }

  describe('createCustomer', () => {
    describe('When there is no request body', () => {
      test('should return Bad Request', async () => {
        const requestBody = {} as UserRequest

        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid request body!'
        )
        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          errorResult,
          requestBody
        )
      })
    })

    describe('When a user name is missing', () => {
      test('should return Bad Request', async () => {
        const requestBody: UserRequest = RequestUtils.generateUserRequest()
        delete requestBody.userName

        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid request body!'
        )
        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          errorResult,
          requestBody
        )
      })
    })

    describe('When an email address is missing', () => {
      test('should return Bad Request', async () => {
        const requestBody: UserRequest = RequestUtils.generateUserRequest()
        delete requestBody.emailAddress

        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid request body!'
        )
        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          errorResult,
          requestBody
        )
      })
    })

    describe('When a name is missing', () => {
      test('should return Bad Request', async () => {
        const requestBody: UserRequest = RequestUtils.generateUserRequest()
        delete requestBody.name

        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid request body!'
        )
        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          errorResult,
          requestBody
        )
      })
    })

    describe('Unexpected internal situations', () => {
      const message = chance.string()
      test('should return Internal Server Error', async () => {
        const requestBody = RequestUtils.generateUserRequest()
        const errorResult = new InternalServerErrorResult(
          ErrorCodes.InternalServerError,
          message
        )
        jest
          .spyOn(customerCreationUseCase, 'createCustomer')
          .mockRejectedValueOnce(
            new InternalServerErrorResult(
              ErrorCodes.InternalServerError,
              message
            )
          )

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.InternalServerError,
          errorResult,
          requestBody
        )
      })
    })

    describe('When a user name is not valid', () => {
      test('should return Bad Request', async () => {
        const requestBody = RequestUtils.generateUserRequest()
        requestBody.userName = 'invalid-user-name!'

        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid user name!'
        )

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          errorResult,
          requestBody
        )
      })
    })

    describe('When an email address is not valid', () => {
      test('should return Bad Request', async () => {
        const requestBody = RequestUtils.generateUserRequest()
        requestBody.emailAddress = 'invalid-email-address!'

        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid email address!'
        )

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          errorResult,
          requestBody
        )
      })
    })

    describe('When a name is not valid', () => {
      test('should return Bad Request', async () => {
        const requestBody = RequestUtils.generateUserRequest()
        requestBody.name = 'invalid-name!'

        const errorResult = new BadRequestResult(
          ErrorCodes.BadRequest,
          'Please specify a valid name!'
        )

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          errorResult,
          requestBody
        )
      })
    })

    describe('When it suceeds', () => {
      test('should return 202', async () => {
        const requestBody = RequestUtils.generateUserRequest()
        jest
          .spyOn(customerCreationUseCase, 'createCustomer')
          .mockResolvedValue()

        const actualResponse: ApiResponseParsed<unknown> = await callSuccessForRequestBody<
          unknown
        >(customerCreationController.createCustomer, requestBody)
        expect(actualResponse.statusCode).toBe(HttpStatusCodes.NoContent)
        expect(actualResponse.parsedBody).toBeEmpty()
      })
    })
  })
})
