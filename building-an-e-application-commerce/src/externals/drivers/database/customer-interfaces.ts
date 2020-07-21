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

export interface UserNameDocument {
  UserName: string
}

export interface Session extends ICustomer {
  sessionToken: string
  createdAt: string
  expiresAt: string
  tTL: number
}

export interface SessionDocument extends UserNameDocument {
  SessionToken: string
  CreatedAt: string
  ExpiresAt: string
  TTL: number
}
