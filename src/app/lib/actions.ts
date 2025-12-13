"use server";

import { z } from "zod";
import { LoginFormState } from "./signin/definitions";

export const createPost = async (formData: FormData) => {
};

const LoginForm = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

export const login = async (
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> => {
  "use server";

  const validatedFields = LoginForm.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "Failed to validate.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const res = await fetch(`${process.env.API_BACKEND_HOST}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    return {
      message: "Login success",
      data: {
        token: data.token
      }
    }
  } catch (err) {
    return {
      message: "Login failed",
      data: {
        token: ''
      }
    }
  }
};
