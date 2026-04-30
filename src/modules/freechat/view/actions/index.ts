"use server"

import { redirect } from "next/navigation";
import { cache } from "react";
import z from "zod";

import { FREECHAT_URL } from "@/app/lib/url_paths";
import * as authService from "@/modules/freechat/services/auth.service";
import * as userService from "@/modules/freechat/services/user.service";
import * as conversationService from "@/modules/freechat/services/conversation.service";
import * as userRepository from "@/modules/freechat/repositories/user.repository";
import AuthenticatedError from "@/modules/freechat/errors/unauthenticated.error";

const LoginFormSchema = z.object({
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  displayName: z
    .string()
    .trim()
    .nullable()
    .optional(),
  password: z
    .string()
    // .min(8, { error: 'Be at least 8 characters long' })
    // .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    // .regex(/[0-9]/, { error: 'Contain at least one number.' })
    // .regex(/[^a-zA-Z0-9]/, {
    //   error: 'Contain at least one special character.',
    // })
    .trim(),
  isNewAccount: z.string()
}).superRefine((data, ctx) => {
  if (data.isNewAccount === '1' && !data.displayName) {
    ctx.addIssue({
      code: 'custom',
      path: ['displayName'],
      message: 'Name is required for new accounts'
    });
  }
});

export type LoginFormState = {
  message?: string
  errors?: {
    email?: string[]
    displayName?: string[]
    password?: string[]
  }
} | undefined;

export const login = async (state: LoginFormState, formData: FormData): Promise<LoginFormState> => {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    displayName: formData.get('displayName'),
    password: formData.get('password'),
    isNewAccount: formData.get('isNewAccount')
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid data',
      errors: z.flattenError(validatedFields.error).fieldErrors,
    }
  }

  if (validatedFields.data.isNewAccount === '1' && validatedFields.data.displayName) {
    const userId = await userService.registerUser({
      email: validatedFields.data.email,
      display_name: validatedFields.data.displayName,
      password: validatedFields.data.password
    });

    if (!userId) {
      return {
        message: 'Failed to registration'
      }
    }

    const participants = await conversationService.addUsersToConversation({ conversationId: '00000000-0000-0000-0000-000000000000', userIds: [userId] });
    if (participants.length === 0) {
      console.warn(`[WARN] Join new user into default chatroom failed`);
    }
  }

  const user = await userRepository.getByEmail(validatedFields.data.email);
  if (!user) {
    return {
      message: 'User not found'
    }
  }
  if (!user.passwordHash) {
    return {
      message: 'User password not found'
    }
  }
  const isMatch = await userService.comparePassword(validatedFields.data.password, user.passwordHash);

  if (!isMatch) {
    return {
      message: 'User password not match'
    }
  }

  await authService.createJwt(user.id)

  redirect(FREECHAT_URL);
}

export const logout = async () => {
  await authService.deleteJwt();
  redirect(FREECHAT_URL);
};

export const verifyAuthUser = cache(
  async () => {
    const session = await authService.verifySession();
    if (!session || !session.isAuth || !session.userId) throw new AuthenticatedError();
    const user = await userService.fetchUserById(session.userId as string);
    return user ?? null;
  }
)
