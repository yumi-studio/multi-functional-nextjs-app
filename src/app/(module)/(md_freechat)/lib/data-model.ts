"use server";

export const TABLE_USERS = "fc_users";
export type UserModel = {
  id?: string;
  email?: string;
  display_name?: string;
  password_hash?: string;
  created_at?: Date;
  updated_at?: Date;
};
