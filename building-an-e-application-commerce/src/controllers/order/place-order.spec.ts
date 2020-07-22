import { OrderPlacementController } from '@controllers/order/place-order'
import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { ApiHandler } from '@presenters/interfaces'
import { HttpStatusCodes } from '@presenters/status-codes'
import {
  callFailureForRequestBodyAndParameter,
  callSuccessForRequestBodyAndParameter,
} from '@test/utils/caller'
import { ApiResponseParsed, PathParameters } from '@test/utils/interfaces'
import { OrderPlacementUseCase } from '@use-cases/order/place-order'
import { Chance } from 'chance'
import { RequestUtils } from '@test/utils/request-utils'
import { CustomerDatabaseDriver } from '@externals/drivers/database/customer-table'
import { IOrderRequestBody } from '@externals/drivers/database/customer-interfaces'

const chance = new Chance.Chance()

describe('OrderPlacementController', () => {
  const orderPlacementUseCase = new OrderPlacementUseCase(
    new CustomerDatabaseDriver()
  )
  const orderPlacementController = new OrderPlacementController(
    orderPlacementUseCase
  )

  async function callAndCheckError(
    handler: ApiHandler,
    expectedHttpStatusCode: number,
    errorCode: string,
    requestBody: IOrderRequestBody,
    pathParameters: PathParameters
  ): Promise<void> {
    const response = await callFailureForRequestBodyAndParameter(
      handler,
      requestBody,
      pathParameters
    )

    expect(response.statusCode).toBe(expectedHttpStatusCode)
    expect(response.parsedBody.error.code).toBe(errorCode)
    expect(response.parsedBody.error.description).not.toBeEmpty()
  }

  describe('placeOrder', () => {
    describe('When there is no request body', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          customer: RequestUtils.generateCustomerName(),
        }
        const requestBody = {} as IOrderRequestBody

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When there is no path parameter', () => {
      test('should return Bad Request', async () => {
        const pathParameters = {} as PathParameters
        const requestBody = {} as IOrderRequestBody

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When a customer name is missing', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          dummy: RequestUtils.generateCustomerName(),
        }
        const requestBody = RequestUtils.generateOrderRequestBody()

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When amount is missing', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          customer: RequestUtils.generateCustomerName(),
        }
        const requestBody = RequestUtils.generateOrderRequestBody()
        delete requestBody.amount

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When status is missing', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          customer: RequestUtils.generateCustomerName(),
        }
        const requestBody = RequestUtils.generateOrderRequestBody()
        delete requestBody.status

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When number items is missing', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          customer: RequestUtils.generateCustomerName(),
        }
        const requestBody = RequestUtils.generateOrderRequestBody()
        delete requestBody.numberItems

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('Unexpected internal situations', () => {
      test('should return Internal Server Error', async () => {
        const pathParameters: PathParameters = {
          customer: RequestUtils.generateCustomerName(),
        }
        const requestBody = RequestUtils.generateOrderRequestBody()
        jest
          .spyOn(orderPlacementUseCase, 'placeOrder')
          .mockRejectedValueOnce(
            new InternalServerErrorResult(
              ErrorCodes.InternalServerError,
              chance.string()
            )
          )

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.InternalServerError,
          ErrorCodes.InternalServerError,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When a customer name is not valid', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          customer: 'invalid-customer-name!',
        }
        const requestBody = RequestUtils.generateOrderRequestBody()

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When status is not valid', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          customer: RequestUtils.generateCustomerName(),
        }
        const requestBody = RequestUtils.generateOrderRequestBody()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        requestBody.status = 'invalid-email-address!'

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When amount is not valid', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          customer: RequestUtils.generateCustomerName(),
        }
        const requestBody = RequestUtils.generateOrderRequestBody()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        requestBody.amount = 'invalid-amount!'

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When number items is not valid', () => {
      test('should return Bad Request', async () => {
        const pathParameters: PathParameters = {
          customer: RequestUtils.generateCustomerName(),
        }
        const requestBody = RequestUtils.generateOrderRequestBody()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        requestBody.numberItems = 'invalid-amount!'

        await callAndCheckError(
          orderPlacementController.placeOrder,
          HttpStatusCodes.BadRequest,
          ErrorCodes.BadRequest,
          requestBody,
          pathParameters
        )
      })
    })

    describe('When it suceeds', () => {
      test('should return 202', async () => {
        const pathParameters: PathParameters = {
          customer: RequestUtils.generateCustomerName(),
        }
        const requestBody = RequestUtils.generateOrderRequestBody()
        jest.spyOn(orderPlacementUseCase, 'placeOrder').mockResolvedValue()

        const actualResponse: ApiResponseParsed<unknown> = await callSuccessForRequestBodyAndParameter<
          unknown
        >(orderPlacementController.placeOrder, requestBody, pathParameters)
        expect(actualResponse.statusCode).toBe(HttpStatusCodes.NoContent)
        expect(actualResponse.parsedBody).toBeEmpty()
      })
    })
  })
})
