import { CustomerCreationController } from '@controllers/customer/create-customer'
import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
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
import { ICustomer } from '@externals/drivers/database/customer-interfaces'

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
    errorCode: string,
    requestBody: ICustomer
  ): Promise<void> {
    const response = await callFailureForRequestBody(handler, requestBody)

    expect(response.statusCode).toBe(expectedHttpStatusCode)
    expect(response.parsedBody.error.code).toBe(errorCode)
    expect(response.parsedBody.error.description).not.toBeEmpty()
  }

  describe('createCustomer', () => {
    describe('When there is no request body', () => {
      test('should return Bad Request', async () => {
        const requestBody = {} as ICustomer

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody
        )
      })
    })

    describe('When a customer name is missing', () => {
      test('should return Bad Request', async () => {
        const requestBody: ICustomer = RequestUtils.generateCustomer()
        delete requestBody.customerName

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody
        )
      })
    })

    describe('When an email address is missing', () => {
      test('should return Bad Request', async () => {
        const requestBody: ICustomer = RequestUtils.generateCustomer()
        delete requestBody.emailAddress

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody
        )
      })
    })

    describe('When a name is missing', () => {
      test('should return Bad Request', async () => {
        const requestBody: ICustomer = RequestUtils.generateCustomer()
        delete requestBody.name

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody
        )
      })
    })

    describe('Unexpected internal situations', () => {
      test('should return Internal Server Error', async () => {
        const requestBody = RequestUtils.generateCustomer()
        jest
          .spyOn(customerCreationUseCase, 'createCustomer')
          .mockRejectedValueOnce(
            new InternalServerErrorResult(
              ErrorCodes.InternalServerError,
              chance.string()
            )
          )

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.InternalServerError,
          ErrorCodes.InternalServerError,
          requestBody
        )
      })
    })

    describe('When a customer name is not valid', () => {
      test('should return Bad Request', async () => {
        const requestBody = RequestUtils.generateCustomer()
        requestBody.customerName = 'invalid-customer-name!'

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody
        )
      })
    })

    describe('When an email address is not valid', () => {
      test('should return Bad Request', async () => {
        const requestBody = RequestUtils.generateCustomer()
        requestBody.emailAddress = 'invalid-email-address!'

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody
        )
      })
    })

    describe('When a name is not valid', () => {
      test('should return Bad Request', async () => {
        const requestBody = RequestUtils.generateCustomer()
        requestBody.name = 'invalid-name!'

        await callAndCheckError(
          customerCreationController.createCustomer,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody
        )
      })
    })

    describe('When it comes to home property', () => {
      describe('When a street is missing', () => {
        test('should return Bad Request', async () => {
          const requestBody = RequestUtils.generateCustomer()
          delete requestBody.address.home.street

          await callAndCheckError(
            customerCreationController.createCustomer,
            HttpStatusCodes.BadRequest,
            ErrorCodes.BadRequest,
            requestBody
          )
        })
      })

      describe('When a city is missing', () => {
        test('should return Bad Request', async () => {
          const requestBody = RequestUtils.generateCustomer()
          delete requestBody.address.home.city

          await callAndCheckError(
            customerCreationController.createCustomer,
            HttpStatusCodes.BadRequest,
            ErrorCodes.BadRequest,
            requestBody
          )
        })
      })

      describe('When a state is missing', () => {
        test('should return Bad Request', async () => {
          const requestBody = RequestUtils.generateCustomer()
          delete requestBody.address.home.state

          await callAndCheckError(
            customerCreationController.createCustomer,
            HttpStatusCodes.BadRequest,
            ErrorCodes.BadRequest,
            requestBody
          )
        })
      })
    })

    describe('When it comes to business property', () => {
      describe('When a street is missing', () => {
        test('should return Bad Request', async () => {
          const requestBody = RequestUtils.generateCustomer(true)
          delete requestBody.address.business!.street

          await callAndCheckError(
            customerCreationController.createCustomer,
            HttpStatusCodes.BadRequest,
            ErrorCodes.BadRequest,
            requestBody
          )
        })
      })

      describe('When a city is missing', () => {
        test('should return Bad Request', async () => {
          const requestBody = RequestUtils.generateCustomer(true)
          delete requestBody.address.business!.city

          await callAndCheckError(
            customerCreationController.createCustomer,
            HttpStatusCodes.BadRequest,
            ErrorCodes.BadRequest,
            requestBody
          )
        })
      })

      describe('When a state is missing', () => {
        test('should return Bad Request', async () => {
          const requestBody = RequestUtils.generateCustomer(true)
          delete requestBody.address.business!.state

          await callAndCheckError(
            customerCreationController.createCustomer,
            HttpStatusCodes.BadRequest,
            ErrorCodes.BadRequest,
            requestBody
          )
        })
      })
    })

    describe('When it suceeds', () => {
      test('should return 202', async () => {
        const requestBody = RequestUtils.generateCustomer()
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
