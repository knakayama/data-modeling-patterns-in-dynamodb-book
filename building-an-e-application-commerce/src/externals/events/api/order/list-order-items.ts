import { OrderItemListingController } from '@controllers/order/list-order-items'
import { OrderItemListingUseCase } from '@use-cases/order/list-order-items'
import { CustomerDatabaseDriver } from '@externals/drivers/database/customer-table'
import { ApiInterceptor } from '@middlewares/api/interceptor'

const customerDatabaseDriver = new CustomerDatabaseDriver()
const orderItemListingUseCase = new OrderItemListingUseCase(
  customerDatabaseDriver
)
const orderItemListingController = new OrderItemListingController(
  orderItemListingUseCase
)
const apiInterceptor = new ApiInterceptor(
  orderItemListingController.listOrderItems
)

export const listOrderItems = apiInterceptor.intercept
