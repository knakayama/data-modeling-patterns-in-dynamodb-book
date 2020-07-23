export interface ICustomerOrderRequest {
  customerName: string
}

export interface ICustomerOrderItemRequest extends ICustomerOrderRequest {
  orderId: string
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

export interface IOrderResponse {
  orderId: string
  createdAt: string
  status: OrderStatus
  amount: number
  numberItems: number
}

export interface IOrderItemResponse extends IOrderResponse {
  orderItems: IOrderItemRequest[]
}
