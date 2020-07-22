export interface IAddressDetail {
  street: string
  city: string
  state: string
}

export interface IAddress {
  home: IAddressDetail
  business?: IAddressDetail
}

export interface ICustomer {
  customerName: string
  emailAddress: string
  name: string
  address: IAddress
}

export type OrderStatus = 'SHIPPED' | 'CANCELED' | 'PROCESSING'

export interface IOrderRequestBody {
  status: OrderStatus
  amount: number
  numberItems: number
}

export interface IOrderRequest extends IOrderRequestBody {
  customerName: string
}
