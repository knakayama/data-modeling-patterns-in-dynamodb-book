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
  userName: string
  emailAddress: string
  name: string
  address: IAddress
}

export interface IOrderRequest {
  userName: string
  status: 'SHIPPED' | 'CANCELED' | 'PROCESSING'
  amount: number
  numberItems: number
}
