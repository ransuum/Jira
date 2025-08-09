export interface User {
  username: string
  email: string
  accessToken: string
  accessTokenExpiry: number
  tokenType: string
}

export interface AuthResponse {
  access_token: string
  access_token_expiry: number
  token_type: string
  user_name: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  username: string
  email: string
  password: string
  providerId?: string
}
