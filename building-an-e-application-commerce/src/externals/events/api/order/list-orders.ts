import { OrderListingController } from '@controllers/order/list-orders'
import { OrderListingUseCase } from '@use-cases/order/list-orders'
import { CustomerDatabaseDriver } from '@externals/drivers/database/customer-table'
import { ApiInterceptor } from '@middlewares/api/interceptor'

const customerDatabaseDriver = new CustomerDatabaseDriver()
const orderListingUseCase = new OrderListingUseCase(customerDatabaseDriver)
const orderListingController = new OrderListingController(orderListingUseCase)
const apiInterceptor = new ApiInterceptor(orderListingController.listOrders)

export const listOrders = apiInterceptor.intercept
