"use server";

import bcrypt from 'bcrypt';
import fp from 'lodash/fp';
import * as userRepository from "../repositories/user.repository";
import { User } from '../types';

const PASSWORD_ENCRYPT_SALT = parseInt(`${process.env.FREECHAT_PASSWORD_ENCRYPT_SALT ?? 10}`);

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

export const fetchAllUsers = async () => {
  return (await userRepository.getAll()).map((user) => fp.omit('passwordHash')(user)) as User[];
}
