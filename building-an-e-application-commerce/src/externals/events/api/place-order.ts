import { OrderPlacementController } from '@controllers/order/place-order'
import { OrderPlacementUseCase } from '@use-cases/order/place-order'
import { OrderAndItemTransactionDriver } from '@externals/drivers/database/order-and-item-transaction'
import { ApiInterceptor } from '@middlewares/api/interceptor'

const orderAndItemTransactionDriver = new OrderAndItemTransactionDriver()
const orderPlacementUseCase = new OrderPlacementUseCase(
  orderAndItemTransactionDriver
)
const orderPlacementController = new OrderPlacementController(
  orderPlacementUseCase
)
const apiInterceptor = new ApiInterceptor(orderPlacementController.placeOrder)

export const placeOrder = apiInterceptor.intercept
