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
  username: string,
  password: string,
}
