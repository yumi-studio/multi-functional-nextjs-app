export type UserDetail = {
  id: string,
  email: string,
  username: string,
  firstName: string,
  lastName: string,
  gender: 0 | 1 | 2
  bio?: string,
  birthDate?: Date,
  avatar?: string
}

export type LoginRequest = {
  email: string,
  password: string
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

export type FormState<T, E> = {
  message?: string | null;
  data?: T;
  errors?: E;
};

export type LoginFormError = {
  username?: string[];
  password?: string[];
};

export type LoginFormData = {
  token?: string;
};

export type LoginFormState = FormState<LoginFormData, LoginFormError>;

export type LoginForm = {
  email: string,
  password: string,
}
