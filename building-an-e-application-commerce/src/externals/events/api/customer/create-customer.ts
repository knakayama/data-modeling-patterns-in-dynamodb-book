import { CustomerCreationController } from '@controllers/customer/create-customer'
import { CustomerCreationUseCase } from '@use-cases/customer/create-customer'
import { CusAndCusAddrTransactionDriver } from '@externals/drivers/database/customer-and-customer-address-transaction'
import { ApiInterceptor } from '@middlewares/api/interceptor'

const cusAndCusAddrTransactionDatabaseDriver = new CusAndCusAddrTransactionDriver()
const customerCreationUseCase = new CustomerCreationUseCase(
  cusAndCusAddrTransactionDatabaseDriver
)
const customerCreationController = new CustomerCreationController(
  customerCreationUseCase
)
const apiInterceptor = new ApiInterceptor(
  customerCreationController.createCustomer
)

export const createCustomer = apiInterceptor.intercept
