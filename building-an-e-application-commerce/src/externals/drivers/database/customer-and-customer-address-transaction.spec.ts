import { CusAndCusAddrTransactionDriver } from '@externals/drivers/database/customer-and-customer-address-transaction'
import { CustomerTableUtils } from '@test/utils/customer-table-utils'
import { RequestUtils } from '@test/utils/request-utils'

process.env.APP_TABLE = 'App'

describe('CusAndCuAddrTransactionDriver', () => {
  const customerTableUtils = new CustomerTableUtils(process.env.APP_TABLE!)
  const cusAndCusAddrTransactionDriver = new CusAndCusAddrTransactionDriver(
    customerTableUtils.dynamoDBD
  )

  describe('createCustomer', () => {
    beforeEach(async () => {
      await customerTableUtils.createTable()
    })

    afterEach(async () => {
      await customerTableUtils.deleteTable()
    })

    describe('When everything is ok', () => {
      const customer = RequestUtils.generateCustomer()
      test('should create a customer', async () => {
        await cusAndCusAddrTransactionDriver.createCustomer(customer)
        const actual = await customerTableUtils.findCustomerByCustomerName(
          customer.customerName
        )

        expect(actual).toStrictEqual(customer)
      })
    })
  })
})
