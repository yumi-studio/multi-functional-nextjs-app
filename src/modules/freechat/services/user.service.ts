import 'server-only';
import bcrypt from 'bcrypt';
import fp from 'lodash/fp';
import * as userRepository from "../repositories/user.repository";
import * as conversationRepository from "../repositories/conversation.repository";
import { SelectUser } from '../db/schema';

const PASSWORD_ENCRYPT_SALT = parseInt(`${process.env.FREECHAT_PASSWORD_ENCRYPT_SALT ?? 10}`);

type User = Omit<SelectUser, 'passwordHash'>

export const registerUser = async ({
  email, display_name, password
}: {
  email: string, display_name: string, password: string
}) => {
  const hashedPassword = await bcrypt.hash(password, PASSWORD_ENCRYPT_SALT);
  const newUserId = await userRepository.createOne({
    email: email,
    displayName: display_name,
    passwordHash: hashedPassword
  });
  return newUserId;
}

const safeParseUser = (user: SelectUser) => {
  return fp.omit('passwordHash')(user) as User;
}

export const fetchAllUsers = async () => {
  return (await userRepository.getAll()).map((user) => safeParseUser(user));
}

export const fetchUserByEmail = async (email: string) => {
  try {
    const user = await userRepository.getByEmail(email);
    if (user) {
      return safeParseUser(user);
    }
  } catch (error) {
    return null;
  }
}

export const fetchUserById = async (id: string) => {
  try {
    const user = await userRepository.getById(id);
    if (user) {
      return safeParseUser(user);
    }
  } catch (error) {
    return null;
  }
}
