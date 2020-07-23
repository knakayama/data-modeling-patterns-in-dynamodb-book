export interface ICustomerOrderRequest {
  customerName: string
}

export interface IAddressDetail {
  street: string
  city: string
  state: string
}

export interface IAddress {
  home: IAddressDetail
  business?: IAddressDetail
}

export interface ICustomer extends ICustomerOrderRequest {
  emailAddress: string
  name: string
  address: IAddress
}

export type OrderStatus = 'SHIPPED' | 'CANCELED' | 'PROCESSING'

export interface IOrderItemRequest {
  itemId: string
  description: string
  price: number
}

export type OrderItem = IOrderItemRequest

export interface IOrderRequestBody {
  status: OrderStatus
  amount: number
  numberItems: number
  orderItems: IOrderItemRequest[]
}

export interface IOrderRequest extends IOrderRequestBody {
  customerName: string
}

export interface IOrder extends IOrderRequestBody {
  orderId: string
  createdAt: string
}
