export type UserDetail = {
  id: string,
  email: string,
  username: string,
  firstName: string,
  lastName: string,
  gender: 0 | 1 | 2
  bio?: string,
  birthDate?: Date
}

export type LoginRequest = {
  username: string,
  password: string,
  loginType: number
}

export type LoginResponse = {
  token?: string
}

export type RegisterRequest = {
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  birthDate: string,
  gender: number
}

export type RegisterResponse = {
  id: string
}
