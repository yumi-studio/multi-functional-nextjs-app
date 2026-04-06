"use server";

import { db } from "./db";

export const testConnection = async () => {
  const result = await db.execute('SELECT 1');
  console.log(result);
}
