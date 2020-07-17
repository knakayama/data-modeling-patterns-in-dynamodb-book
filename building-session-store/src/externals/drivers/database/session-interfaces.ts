export interface UserName {
  userName: string
}

export interface UserNameDocument {
  UserName: string
}

export interface Session extends UserName {
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
