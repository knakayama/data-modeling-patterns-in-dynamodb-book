export interface User {
  userName: string
  emailAddress: string
  name: string
}

export interface UserRequest {
  userName: string
  emailAddress: string
  name: string
}

export interface UserNameDocument {
  UserName: string
}

export interface Session extends UserRequest {
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
