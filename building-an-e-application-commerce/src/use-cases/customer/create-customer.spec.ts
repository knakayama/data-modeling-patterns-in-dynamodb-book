import { ErrorCodes } from '@presenters/error-codes'
import { InternalServerErrorResult } from '@presenters/errors'
import { CustomerCreationUseCase } from '@use-cases/customer/create-customer'
import { CusAndCusAddrTransactionDriver } from '@externals/drivers/database/customer-and-customer-address-transaction'
import { Chance } from 'chance'
import { RequestUtils } from '@test/utils/request-utils'

const chance = new Chance.Chance()

describe('CustomerCreationUseCase', () => {
  const customerDatabaseDriver = new CusAndCusAddrTransactionDriver()
  const customerCreationUseCase = new CustomerCreationUseCase(
    customerDatabaseDriver
  )

  describe('createCustomer', () => {
    describe('When an exception happens', () => {
      const customer = RequestUtils.generateCustomer()
      const message = chance.string()

      test('should return Promise rejection', async () => {
        jest
          .spyOn(customerDatabaseDriver, 'createCustomer')
          .mockImplementationOnce(() => {
            throw new Error(message)
          })

        await customerCreationUseCase
          .createCustomer(customer)
          .catch((error: InternalServerErrorResult) => {
            expect(error).toBeInstanceOf(InternalServerErrorResult)
            expect(error.code).toEqual(ErrorCodes.InternalServerError)
            expect(error.description).toEqual(message)
          })
      })
    })

    describe('When everthing is ok', () => {
      const customer = RequestUtils.generateCustomer()

      test('should return a book', async () => {
        jest
          .spyOn(customerDatabaseDriver, 'createCustomer')
          .mockResolvedValueOnce()

        const actual = await customerCreationUseCase.createCustomer(customer)
        expect(actual).toBeUndefined()
      })
    })
  })
})
