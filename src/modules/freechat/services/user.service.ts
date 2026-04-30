import 'server-only';
import bcrypt from 'bcrypt';
import { omit } from 'lodash';
import * as userRepository from "@/modules/freechat/repositories/user.repository";
import { SelectUser } from '@/modules/freechat/db/schema';
import { PASSWORD_ENCRYPT_SALT } from '@/modules/freechat/shared/constants';
import { User } from '@/modules/freechat/shared/types';

export const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, PASSWORD_ENCRYPT_SALT);
}

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
}

export const registerUser = async ({
  email, display_name, password
}: {
  email: string;
  display_name: string;
  password: string
}): Promise<string | null> => {
  const hashedPassword = await encryptPassword(password);
  const newUserId = await userRepository.createOne({
    email: email,
    displayName: display_name,
    passwordHash: hashedPassword
  });
  return newUserId;
}

const safeParseUser = (user: SelectUser): User => {
  return omit(user, ['passwordHash']);
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

  }
  return null;
}

export const fetchUserById = async (id: string) => {
  try {
    const user = await userRepository.getById(id);
    if (user) {
      return safeParseUser(user);
    }
  } catch (error) {

  }
  return null;
}
