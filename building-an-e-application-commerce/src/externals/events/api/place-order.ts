import { OrderPlacementController } from '@controllers/order/place-order'
import { OrderPlacementUseCase } from '@use-cases/order/place-order'
import { CustomerDatabaseDriver } from '@externals/drivers/database/customer-table'
import { ApiInterceptor } from '@middlewares/api/interceptor'

const customerDatabaseDriver = new CustomerDatabaseDriver()
const orderPlacementUseCase = new OrderPlacementUseCase(customerDatabaseDriver)
const orderPlacementController = new OrderPlacementController(
  orderPlacementUseCase
)
const apiInterceptor = new ApiInterceptor(orderPlacementController.placeOrder)

export const placeOrder = apiInterceptor.intercept
