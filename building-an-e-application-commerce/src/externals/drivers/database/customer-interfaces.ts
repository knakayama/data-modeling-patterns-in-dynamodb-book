export interface ICustomerName {
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

export interface ICustomer extends ICustomerName {
  emailAddress: string
  name: string
  address: IAddress
}

export type OrderStatus = 'SHIPPED' | 'CANCELED' | 'PROCESSING'

export interface IItemRequest {
  itemId: string
  description: string
  price: number
}

export type Item = IItemRequest

export interface IOrderRequestBody {
  status: OrderStatus
  amount: number
  numberItems: number
  items: IItemRequest[]
}

export interface IOrderRequest extends IOrderRequestBody {
  customerName: string
}

export interface IOrder extends IOrderRequestBody {
  orderId: string
  createdAt: string
}
