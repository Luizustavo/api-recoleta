export interface LoginResponseDto {
  access_token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface ValidateTokenResponseDto {
  valid: boolean
  payload?: any
}
